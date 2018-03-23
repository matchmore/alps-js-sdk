import * as models from './models';
export interface Match {
    id?: string;
    createdAt?: number;
    publication: models.Publication;
    subscription: models.Subscription;
}
