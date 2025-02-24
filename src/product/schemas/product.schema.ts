import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
