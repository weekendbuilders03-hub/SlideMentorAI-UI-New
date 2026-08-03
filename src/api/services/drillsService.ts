/**
 * Voice Drills service — Phase 4.
 * Backend endpoints:
 *   GET  /api/v1/drills          → list all drills
 *   GET  /api/v1/drills/{id}     → single drill
 *   POST /api/v1/drills/{id}     → submit drill result
 *
 * The backend returns a "Drills Library DTO" whose exact shape is
 * undocumented beyond field names. This service handles:
 *   A) Flat array: BackendResponse = Drill[]
 *   B) Wrapped:    BackendResponse = { drills: Drill[] }
 *   C) Categorised: BackendResponse = { categories: DrillCategory[] }
 */
import apiClient, { unwrapResponse } from '../axios';
import type { ApiResponse } from '../axios';
import { ENDPOINTS } from '../endpoints';
import type { Drill, DrillCategory, DrillSubmitRequest, DrillSubmitResponse } from '../../types/drills';

/** Parse any backend drills response into a flat Drill[]. */
function parseDrills(raw: any): Drill[] {
  if (!raw) return [];
  // Case C: already categorised — flatten
  if (raw.categories && Array.isArray(raw.categories)) {
    return (raw.categories as DrillCategory[]).flatMap((c) => c.drills ?? []);
  }
  // Case B: wrapped object with drills array
  if (raw.drills && Array.isArray(raw.drills)) return raw.drills;
  // Case A: raw is already an array
  if (Array.isArray(raw)) return raw;
  return [];
}

/** Group a flat Drill[] into DrillCategory[] by category name. */
function groupByCategory(drills: Drill[]): DrillCategory[] {
  const map = new Map<string, DrillCategory>();
  for (const drill of drills) {
    const key = drill.categoryTitle || drill.category || 'All Drills';
    const glyph = drill.categoryGlyph || '🎯';
    if (!map.has(key)) {
      map.set(key, { id: key, name: key, glyph, drills: [] });
    }
    map.get(key)!.drills.push(drill);
  }
  return Array.from(map.values());
}

export const drillsService = {
  /**
   * Get all drills grouped into categories.
   * GET /api/v1/drills
   * Returns: DrillCategory[] — grouped for the "All Drills" tab.
   */
  getCategories: async (): Promise<DrillCategory[]> => {
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.drills.list);
    // The envelope may or may not be present
    const raw = (data as any)?.success !== undefined
      ? unwrapResponse(data as ApiResponse<any>)
      : data;
    const drills = parseDrills(raw);
    return groupByCategory(drills);
  },

  /**
   * Get all drills as a flat array (used for Today's Plan tab).
   * Returns first N drills from the backend, or [] on failure.
   */
  getDrills: async (): Promise<Drill[]> => {
    const { data } = await apiClient.get<ApiResponse<any>>(ENDPOINTS.drills.list);
    const raw = (data as any)?.success !== undefined
      ? unwrapResponse(data as ApiResponse<any>)
      : data;
    return parseDrills(raw);
  },

  /**
   * Get a single drill by ID.
   * GET /api/v1/drills/{id}
   */
  getDrill: async (drillId: string): Promise<Drill | null> => {
    const { data } = await apiClient.get<ApiResponse<Drill>>(
      ENDPOINTS.drills.byId(drillId)
    );
    const raw = (data as any)?.success !== undefined
      ? unwrapResponse(data as ApiResponse<Drill>)
      : data as unknown as Drill;
    return raw ?? null;
  },

  /**
   * Submit a completed drill result.
   * POST /api/v1/drills/{id}
   */
  submitDrill: async (
    drillId: string,
    payload: DrillSubmitRequest
  ): Promise<DrillSubmitResponse> => {
    const { data } = await apiClient.post<ApiResponse<DrillSubmitResponse>>(
      ENDPOINTS.drills.submit(drillId),
      payload
    );
    const raw = (data as any)?.success !== undefined
      ? unwrapResponse(data as ApiResponse<DrillSubmitResponse>)
      : data as unknown as DrillSubmitResponse;
    return raw ?? {};
  },
};
