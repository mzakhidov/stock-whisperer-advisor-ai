
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Briefcase } from 'lucide-react';

interface AboutSectionProps {
  name: string;
  description?: string;
  industry?: string;
  mainProducts?: string[];
}

const AboutSection: React.FC<AboutSectionProps> = ({
  name,
  description,
  industry,
  mainProducts
}) => {
  return (
    <Card className="w-full bg-white shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">About {name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {description && (
            <p className="text-gray-700">{description}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industry && (
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium">{industry}</p>
                </div>
              </div>
            )}
            {mainProducts && mainProducts.length > 0 && (
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Main Products/Services</p>
                  <p className="font-medium">{mainProducts.join(", ")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
