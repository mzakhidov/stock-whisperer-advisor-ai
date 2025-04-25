
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MessageSquare, Smile, Frown, Meh } from 'lucide-react';

interface NewsItem {
  headline: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
}

interface RecentNewsSectionProps {
  news: NewsItem[] | null;
}

const RecentNewsSection: React.FC<RecentNewsSectionProps> = ({ news }) => {
  if (!news || news.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent News & Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">No recent news available for this stock.</p>
        </CardContent>
      </Card>
    );
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="text-green-500" />;
      case 'negative':
        return <Frown className="text-red-500" />;
      default:
        return <Meh className="text-gray-500" />;
    }
  };

  const getSentimentClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent News & Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSentimentClass(item.sentiment)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <p className="font-medium text-gray-900">{item.headline}</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(item.sentiment)}
                      <span className="capitalize">{item.sentiment} sentiment</span>
                    </div>
                    <span className="text-gray-500">{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNewsSection;
