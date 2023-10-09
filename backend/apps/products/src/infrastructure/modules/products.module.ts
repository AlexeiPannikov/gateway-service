import { Module } from '@nestjs/common';
import { ProductsController } from '../../products.controller';
import { ProductsService } from '../../products.service';
import {ConfigModule} from "@nestjs/config";
import {SharedModule} from "@app/shared";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: './.env'}),
    SharedModule.registerAuthDb(),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
