// import { Table, Column, Model, DataType, PrimaryKey, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { CategoryType } from '../types/modal';
import { Service } from "./service";

import { Table, Column, Model, DataType, PrimaryKey,  HasMany } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class Category extends Model<CategoryType> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @HasMany(() => Service)
  services!: Service[];
}

