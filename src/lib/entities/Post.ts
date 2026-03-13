import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { Category } from "./Category";

@Entity("posts")
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ unique: true })
  slug!: string;

  @Column("text")
  content!: string;

  @Column({ nullable: true })
  excerpt!: string;

  @Column({ nullable: true })
  coverImage!: string;

  @Column({ default: false })
  published!: boolean;

  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: true,
    eager: false
  })
  @JoinColumn({ name: "categoryId" })
  category!: Category | null;

  @Column({ nullable: true })
  categoryId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
