import { Environment } from './environment';
import { ITokenService } from './tokenService';
import { IGistIdService } from './gistIdService';
import { IGistServiceFactory } from './gistService';
import { IFileService } from './fileService';

export interface ActionFactory {
    new(tokenService: ITokenService, gistIdService: IGistIdService, gistServiceFactory: IGistServiceFactory, fileService: IFileService): Action;
}

export interface Action {
    run(): Promise<void>;
    name(): string;
}