import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-instagram-feed',
    templateUrl: './instagram-feed.component.html',
    styleUrls: ['./instagram-feed.component.css'],
    standalone: false
})
export class InstagramFeedComponent implements OnInit {
  instagramPosts: any[] = [];
  private accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your Instagram access token
  private userId = 'YOUR_USER_ID'; // Replace with your Instagram user ID

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchInstagramFeed();
  }

  fetchInstagramFeed(): void {
    const apiUrl = `https://graph.instagram.com/${this.userId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${this.accessToken}`;

    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.instagramPosts = response.data;
      },
      error: (error) => {
        console.error('Error fetching Instagram feed:', error);
      }
    });
  }
}
