import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Client } from "./client.entity";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 127 })
  name: string;

  @Column({ length: 127, nullable: true })
  email: string;

  @Column({ length: 127, nullable: true })
  phone_number: string;

  @ManyToOne(() => Client, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  client: Client;
}
