export class ConfigService {
  constructor(public readonly baseUrl: string) {}
}

export const provideConfigMock = {
  provide: ConfigService,
  useValue: new ConfigService('https://api.eternal-holidays.net')
};
