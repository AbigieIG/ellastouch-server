import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';
import { GalleryType } from '../types/modal';

@Table({
  timestamps: true,
})
export class Gallery extends Model<GalleryType> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  public_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;





}
