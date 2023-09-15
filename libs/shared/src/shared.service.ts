import {Injectable, Provider} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {ClientProxyFactory, RmqContext, RmqOptions, Transport} from "@nestjs/microservices";

@Injectable()
export class SharedService {
    constructor(private readonly configService: ConfigService) {
    }

    getRmqOptions(queue: string): RmqOptions {
        const USER = this.configService.get("RABBITMQ_USER")
        const PASSWORD = this.configService.get("RABBITMQ_PASS")
        const HOST = this.configService.get("RABBITMQ_HOST")
        return {
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
                queue,
                noAck: false,
                queueOptions: {
                    durable: true,
                }
            }
        }
    }

    acknowledgeMessage(context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        channel.ack(originalMessage)
    }
}
