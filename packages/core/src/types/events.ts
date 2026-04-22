/** Event types published to SNS */
export enum EventType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ASSET_UPLOADED = 'ASSET_UPLOADED',
  QUOTA_WARNING = 'QUOTA_WARNING',
}

/** Base shape for all SNS event payloads */
export interface BaseEvent {
  eventType: EventType;
  timestamp: string; // ISO 8601
  environment: string; // "dev" | "prod"
}

export interface UserCreatedEvent extends BaseEvent {
  eventType: EventType.USER_CREATED;
  userId: string;
  email: string;
  name: string;
}

export interface QuotaWarningEvent extends BaseEvent {
  eventType: EventType.QUOTA_WARNING;
  userId: string;
  email: string;
  usagePercent: number;
  usedBytes: number;
  limitBytes: number;
}

/** Union of all possible event payloads */
export type MediaForgeEvent = UserCreatedEvent | QuotaWarningEvent;
