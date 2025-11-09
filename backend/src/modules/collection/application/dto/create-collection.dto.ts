export class CreateCollectionDto {
  operatorId: string;
  recyclerNickname?: string; // deprecated
  userId?: string;
  materialType: string;
  quantity: number;
}
