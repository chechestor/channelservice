import type { Crew, Request } from "../types";

export function requiredEquipment(workType: string): string {
  return workType === "Телеинспекция" ? "Телеинспекция" : "Промывка";
}

export function equipmentLabel(code: string): string {
  if (code === "Промывка") return "промывочная машина";
  if (code === "Телеинспекция") return "телеинспекционный комплекс";
  return code.toLowerCase();
}

export function getEligibleCrews(
  request: Request,
  crews: Crew[],
  forceNone: boolean,
): Crew[] {
  if (forceNone) {
    return [];
  }

  const need = requiredEquipment(request.workType);
  return crews.filter(
    (crew) => crew.status === "available" && crew.equipment.includes(need),
  );
}

export function pickRecommendation(
  request: Request,
  eligible: Crew[],
): Crew | null {
  if (eligible.length === 0) {
    return null;
  }

  if (request.workType !== "Телеинспекция") {
    const preferred = eligible.find((crew) => crew.id === 3);
    if (preferred) {
      return preferred;
    }
  }

  return eligible[0];
}

export function cloneData<T>(value: T): T {
  return structuredClone(value);
}
