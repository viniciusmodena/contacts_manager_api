import {
  Entity,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Contact } from "./contact.entity";

@Entity()
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 127 })
  first_name: string;

  @Column({ length: 127 })
  last_name: string;

  @Column({ length: 127, unique: true })
  email: string;

  @Column({ select: false })
  password?: string;

  @Column({ length: 127, unique: true })
  phone_number: string;

  @OneToMany(() => Contact, (contact) => contact.client)
  contacts: Contact[];

  @CreateDateColumn()
  created_at: Date;
}
