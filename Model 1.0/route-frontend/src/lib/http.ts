interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithTimeout(url: RequestInfo, options: RequestOptions = {}): Promise<Response> {
  const { timeout = 10000, retries = 0, retryDelay = 1000, ...fetchOptions } = options;

  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
      clearTimeout(id);

      // Retry on 429 (Too Many Requests) or 5xx errors for idempotent GETs
      if (response.status === 429 || (response.status >= 500 && response.status < 600 && fetchOptions.method === 'GET')) {
        if (i < retries) {
          console.warn(`Retrying ${url} due to status ${response.status}. Attempt ${i + 1}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
          continue;
        }
      }
      return response;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        console.error(`Request to ${url} timed out.`);
        throw new Error(`Request to ${url} timed out.`);
      } else if (i < retries) {
        console.warn(`Retrying ${url} due to error: ${error.message}. Attempt ${i + 1}/${retries}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
        continue;
      } else {
        console.error(`Request to ${url} failed after ${retries} retries: ${error.message}`);
        throw error;
      }
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
}

// Helper for JSON schema guards (simplified example)
export function validateJson<T>(data: any, schema: any): T {
  // In a real application, you would use a library like Zod or Joi for robust schema validation.
  // For this exercise, we'll do a basic check.
  if (typeof data === 'object' && data !== null) {
    return data as T;
  }
  throw new Error('Invalid JSON response.');
}
