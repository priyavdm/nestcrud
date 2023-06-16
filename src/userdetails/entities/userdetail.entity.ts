// export class Userdetail {}

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Userdetail{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;
    
    @Column()
    gender: string;

    @Column({default: true})
    isActive: boolean;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn({nullable: true})
    updatedAt: Date;
    
    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @Column({nullable: true})
    createdBy: number;
    
    @Column({nullable: true})
    updatedBy: number;

    @Column({nullable: true})
    deletedBy: number;

    @Column({default: false})
    isVerified: boolean;

    @Column({default:0})
    otp: number;
}
