import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios, { Method } from 'axios';

@Injectable()
export class MovieService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('TMDB_API_URL')!;
    this.apiKey = this.configService.get<string>('TMDB_API_KEY')!;
  }

  async requestTMDB(endpoint: string, method: Method = 'GET', data?: any): Promise<any> {
    const options = {
      method,
      url: `${this.apiUrl}${endpoint}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      data,
    };
    
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(`Erreur TMDB [${method} ${endpoint}]:`, error.response?.data || error.message);
      throw error;
    }
  }
}