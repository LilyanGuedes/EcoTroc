export enum MaterialCategory {
  PLASTICO = 'PLASTICO',
  PAPEL = 'PAPEL',
  VIDRO = 'VIDRO',
  METAL = 'METAL',
}

export class MaterialType {
  private static readonly POINTS_PER_UNIT: Record<MaterialCategory, number> = {
    [MaterialCategory.PLASTICO]: 10,
    [MaterialCategory.PAPEL]: 5,
    [MaterialCategory.VIDRO]: 8,
    [MaterialCategory.METAL]: 12,
  };

  private constructor(private readonly value: MaterialCategory) {}

  static from(value: string): MaterialType {
    const upperValue = value.toUpperCase() as MaterialCategory;
    if (!Object.values(MaterialCategory).includes(upperValue)) {
      throw new Error(`Invalid material type: ${value}`);
    }
    return new MaterialType(upperValue);
  }

  getPointsPerUnit(): number {
    return MaterialType.POINTS_PER_UNIT[this.value];
  }

  getValue(): MaterialCategory {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: MaterialType): boolean {
    return this.value === other.value;
  }
}