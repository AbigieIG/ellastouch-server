import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";
import { Service } from "./service";
import { BookingType } from "../types/modal";

@Table({
  timestamps: true,
})
export class Booking extends Model<BookingType> {
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
    unique: true,
    defaultValue: function() {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let uniqueId = "";
      for (let i = 0; i < 6; i++) {
        uniqueId += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return uniqueId;
    },
  })
  bookingId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  time!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  date!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId!: string | null;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  serviceId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  state!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comment!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  zipCode!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Service)
  service!: Service;
}
