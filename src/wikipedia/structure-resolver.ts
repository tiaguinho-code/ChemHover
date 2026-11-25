interface WikipediaPage {
  pageid?: number;
  title?: string;
  fullurl?: string;
  images?: Array<{ title: string }>;
}

interface WikipediaPageResponse {
  query?: { pages?: Record<string, WikipediaPage> };
}

interface WikipediaImageInfo {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
  descriptionshorturl?: string;
}

interface WikipediaImageResponse {
  query?: {
    pages?: Record<string, { imageinfo?: WikipediaImageInfo[] }>;
  };
}

export interface WikipediaStructureImage {
  imageUrl: string;
  pageUrl: string;
}

const API_ROOT = "https://en.wikipedia.org/w/api.php";
const REQUEST_TIMEOUT_MS = 10_000;

function apiUrl(parameters: Record<string, string>): string {
  const query = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    ...parameters,
  });
  return `${API_ROOT}?${query.toString()}`;
}

function normalizeFileName(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreStructureFile(
  fileTitle: string,
  searchName: string,
  pageTitle: string,
): number {
  const filename = fileTitle.replace(/^File:/i, "");
  const normalizedFilename = normalizeFileName(filename);
  const matchesName = [searchName, pageTitle].some((name) => {
    const normalizedName = normalizeFileName(name);
    return normalizedName.length > 2 && normalizedFilename.includes(normalizedName);
  });
  if (!matchesName) return Number.NEGATIVE_INFINITY;

  let score = 10;
  if (/\b(skeletal|chemical|structure|molecular|molecule|2d)\b/i.test(filename)) {
    score += 100;
  }
  if (/\.svg$/i.test(filename)) score += 30;
  if (/\.(png|jpe?g|webp)$/i.test(filename)) score += 5;
  if (
    /\b(3d|ball.?and.?stick|space.?fill|crystal|powder|tablet|package|bottle|synthesis|mechanism|logo|icon|map|graph|chart|rate|overdose|side effects|photo|portrait|leaf|plant)\b/i.test(
      filename,
    )
  ) {
    score -= 120;
  }
  return score;
}

function selectStructureFile(
  images: Array<{ title: string }>,
  searchName: string,
  pageTitle: string,
): string | undefined {
  return images
    .map(({ title }) => ({
      title,
      score: scoreStructureFile(title, searchName, pageTitle),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)[0]?.title;
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
  private cache = new Map<string, WikipediaStructureImage | null>();
  private pending = new Map<string, Promise<WikipediaStructureImage | null>>();

  resolve(name: string): Promise<WikipediaStructureImage | null> {
    const title = name.normalize("NFKC").trim().replace(/\s+/g, " ");
    const key = title.toLocaleLowerCase();
    if (!key) return Promise.resolve(null);
    if (this.cache.has(key)) return Promise.resolve(this.cache.get(key) ?? null);

    const ongoing = this.pending.get(key);
    if (ongoing) return ongoing;

    const request = this.fetchStructureImage(title);
    this.pending.set(key, request);
    void request.then(
      (image) => {
        this.cache.set(key, image);
        this.pending.delete(key);
      },
      () => this.pending.delete(key),
    );
    return request;
  }

  private async fetchStructureImage(
    searchName: string,
  ): Promise<WikipediaStructureImage | null> {
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
    if (pageResponse.status === 404) return null;
    if (!pageResponse.ok) {
      throw new Error(
        `Wikipedia request failed (${pageResponse.status} ${pageResponse.statusText}).`,
      );
    }

    const pageData = (await pageResponse.json()) as WikipediaPageResponse;
    const page = Object.values(pageData.query?.pages ?? {}).find(
      (candidate) => candidate.pageid !== undefined,
    );
    if (!page?.title || !page.images?.length) return null;

    const fileTitle = selectStructureFile(page.images, searchName, page.title);
    if (!fileTitle) return null;

    const imageResponse = await fetch(
      apiUrl({
        titles: fileTitle,
        prop: "imageinfo",
        iiprop: "url",
        iiurlwidth: "500",
      }),
      {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: { Accept: "application/json" },
      },
    );
    if (imageResponse.status === 404) return null;
    if (!imageResponse.ok) {
      throw new Error(
        `Wikimedia image request failed (${imageResponse.status} ${imageResponse.statusText}).`,
      );
    }

    const imageData = (await imageResponse.json()) as WikipediaImageResponse;
    const imageInfo = Object.values(imageData.query?.pages ?? {})
      .flatMap((file) => file.imageinfo ?? [])
      .at(0);
    const imageUrl = imageInfo?.thumburl ?? imageInfo?.url;
    const pageUrl =
      imageInfo?.descriptionurl ?? imageInfo?.descriptionshorturl ?? page.fullurl;
    if (
      !imageUrl ||
      !pageUrl ||
      !isWikimediaUrl(imageUrl) ||
      !isSourcePageUrl(pageUrl)
    ) {
      return null;
    }

    return { imageUrl, pageUrl };
  }
}
