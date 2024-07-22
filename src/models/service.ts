import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from "./category"; 
import { ServiceType } from '../types/modal';

@Table({
  timestamps: true,
})
export class Service extends Model<ServiceType> {
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
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  duration!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  description!: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  workingHours!: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  extraCharges!: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  terms!: string[];

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  categoryId!: string;

  @BelongsTo(() => Category)
  category!: Category;
}
