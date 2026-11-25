interface WikipediaPage {
  pageid?: number;
  title?: string;
  images?: Array<{ title: string }>;
}

interface WikipediaPageResponse {
  query?: { pages?: Record<string, WikipediaPage> };
}

interface MetadataValue {
  value?: string;
}

interface WikipediaImageInfo {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
  descriptionshorturl?: string;
  extmetadata?: {
    ObjectName?: MetadataValue;
    ImageDescription?: MetadataValue;
    Categories?: MetadataValue;
    LicenseShortName?: MetadataValue;
  };
}

interface WikipediaImageResponse {
  query?: {
    pages?: Record<string, { title?: string; imageinfo?: WikipediaImageInfo[] }>;
  };
}

export interface WikipediaStructureImage {
  fileTitle: string;
  imageUrl: string;
  pageUrl: string;
  license?: string;
}

const API_ROOT = "https://en.wikipedia.org/w/api.php";
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_FILES_TO_INSPECT = 50;
const MAX_STRUCTURE_IMAGES = 12;

const STRUCTURE_TERMS =
  /\b(skeletal|chemical|structural|molecular|line)\s+(formula|structure|structures)\b|\bstructure of\b/i;
const STRUCTURE_FILENAME_TERMS =
  /\b(skeletal|chemical|structural|molecular|molecule|2d|structure|formula)\b/i;
const NON_STRUCTURE_TERMS =
  /\b(map|maps|world|death|deaths|rate|rates|overdose|overdoses|timeline|chart|graph|powder|tablet|package|bottle|synthesis|mechanism|logo|icon|side effects|photo|portrait|leaf|plant)\b/i;

function apiUrl(parameters: Record<string, string>): string {
  const query = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    ...parameters,
  });
  return `${API_ROOT}?${query.toString()}`;
}

function normalizeText(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ");
}

function isLikelyImageFile(
  fileTitle: string,
  searchName: string,
  pageTitle: string,
): boolean {
  const filename = normalizeText(fileTitle.replace(/^File:/i, ""));
  const matchesName = [searchName, pageTitle].some((name) => {
    const normalizedName = normalizeText(name);
    return normalizedName.length > 2 && filename.includes(normalizedName);
  });
  return matchesName || STRUCTURE_FILENAME_TERMS.test(filename);
}

function scoreStructureImage(
  fileTitle: string,
  imageInfo: WikipediaImageInfo,
  searchName: string,
  pageTitle: string,
): number {
  const metadata = imageInfo.extmetadata;
  const details = [
    fileTitle,
    metadata?.ObjectName?.value,
    metadata?.ImageDescription?.value,
    metadata?.Categories?.value,
  ]
    .filter((value): value is string => Boolean(value))
    .map(stripHtml)
    .join(" ");
  const normalizedDetails = normalizeText(details);
  const matchesName = [searchName, pageTitle].some((name) => {
    const normalizedName = normalizeText(name);
    return normalizedName.length > 2 && normalizedDetails.includes(normalizedName);
  });
  if (!matchesName || !STRUCTURE_TERMS.test(details) || NON_STRUCTURE_TERMS.test(details)) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 100;
  if (/chemical structures|skeletal formula|structural formula/i.test(details)) score += 40;
  if (/\.svg$/i.test(fileTitle)) score += 20;
  return score;
}

function isWikimediaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "wikimedia.org" || url.hostname.endsWith(".wikimedia.org"))
    );
  } catch {
    return false;
  }
}

function isSourcePageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      (url.hostname === "wikipedia.org" ||
        url.hostname.endsWith(".wikipedia.org") ||
        url.hostname === "wikimedia.org" ||
        url.hostname.endsWith(".wikimedia.org"))
    );
  } catch {
    return false;
  }
}

export class WikipediaStructureResolver {
  private cache = new Map<string, WikipediaStructureImage[]>();
  private pending = new Map<string, Promise<WikipediaStructureImage[]>>();

  resolve(name: string): Promise<WikipediaStructureImage[]> {
    const title = name.normalize("NFKC").trim().replace(/\s+/g, " ");
    const key = title.toLocaleLowerCase();
    if (!key) return Promise.resolve([]);
    if (this.cache.has(key)) return Promise.resolve(this.cache.get(key) ?? []);

    const ongoing = this.pending.get(key);
    if (ongoing) return ongoing;

    const request = this.fetchStructureImages(title);
    this.pending.set(key, request);
    void request.then(
      (images) => {
        this.cache.set(key, images);
        this.pending.delete(key);
      },
      () => this.pending.delete(key),
    );
    return request;
  }

  private async fetchStructureImages(searchName: string): Promise<WikipediaStructureImage[]> {
    const pageResponse = await fetch(
      apiUrl({
        titles: searchName,
        redirects: "1",
        prop: "images|info",
        inprop: "url",
        imlimit: "max",
      }),
      {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { Accept: "application/json" },
      },
    );
    if (pageResponse.status === 404) return [];
    if (!pageResponse.ok) {
      throw new Error(
        `Wikipedia request failed (${pageResponse.status} ${pageResponse.statusText}).`,
      );
    }

    const pageData = (await pageResponse.json()) as WikipediaPageResponse;
    const page = Object.values(pageData.query?.pages ?? {}).find(
      (candidate) => typeof candidate.pageid === "number" && candidate.pageid > 0,
    );
    if (!page?.title || !page.images?.length) return [];

    const candidates = page.images
      .filter(({ title }) => isLikelyImageFile(title, searchName, page.title ?? ""))
      .slice(0, MAX_FILES_TO_INSPECT);
    if (!candidates.length) return [];

    const imageResponse = await fetch(
      apiUrl({
        titles: candidates.map(({ title }) => title).join("|"),
        prop: "imageinfo",
        iiprop: "url|extmetadata",
        iiurlwidth: "500",
      }),
      {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { Accept: "application/json" },
      },
    );
    if (imageResponse.status === 404) return [];
    if (!imageResponse.ok) {
      throw new Error(
        `Wikimedia image request failed (${imageResponse.status} ${imageResponse.statusText}).`,
      );
    }

    const imageData = (await imageResponse.json()) as WikipediaImageResponse;
    return Object.values(imageData.query?.pages ?? {})
      .flatMap((file) =>
        (file.imageinfo ?? []).map((imageInfo) => ({
          fileTitle: file.title ?? "",
          imageInfo,
        })),
      )
      .map(({ fileTitle, imageInfo }) => ({
        fileTitle,
        imageInfo,
        score: scoreStructureImage(fileTitle, imageInfo, searchName, page.title ?? ""),
      }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, MAX_STRUCTURE_IMAGES)
      .flatMap(({ fileTitle, imageInfo }) => {
        const imageUrl = imageInfo.thumburl ?? imageInfo.url;
        const pageUrl = imageInfo.descriptionurl ?? imageInfo.descriptionshorturl;
        if (
          !imageUrl ||
          !pageUrl ||
          !isWikimediaUrl(imageUrl) ||
          !isSourcePageUrl(pageUrl)
        ) {
          return [];
        }
        return [
          {
            fileTitle: fileTitle.replace(/^File:/i, ""),
            imageUrl,
            pageUrl,
            license: imageInfo.extmetadata?.LicenseShortName?.value,
          },
        ];
      });
  }
}
