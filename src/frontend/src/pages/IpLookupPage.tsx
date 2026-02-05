import { useState, FormEvent } from 'react';
import { Search, Globe, MapPin, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useVisitorIp } from '@/hooks/useVisitorIp';
import { useIpLookup } from '@/hooks/useIpLookup';

export default function IpLookupPage() {
  const [lookupInput, setLookupInput] = useState('');
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  
  const { data: visitorData, isLoading: visitorLoading, error: visitorError } = useVisitorIp(showExtraDetails);
  const { data: lookupData, isPending: lookupLoading, error: lookupError, mutate: performLookup } = useIpLookup(showExtraDetails);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (lookupInput.trim()) {
      performLookup(lookupInput.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">IP Lookup</h1>
              <p className="text-xs text-muted-foreground">Discover IP information instantly</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Your IP Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Your IP Address
              </CardTitle>
              <CardDescription>Automatically detected from your connection</CardDescription>
            </CardHeader>
            <CardContent>
              {visitorLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Detecting your IP address...</span>
                </div>
              ) : visitorError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to detect your IP address. Please check your connection.
                  </AlertDescription>
                </Alert>
              ) : visitorData ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-3 bg-accent/20 rounded-lg border border-accent/30">
                      <p className="text-2xl font-mono font-semibold text-foreground">
                        {visitorData.ip}
                      </p>
                    </div>
                  </div>
                  
                  {showExtraDetails && visitorData.city && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                      {visitorData.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <p className="text-base font-medium">
                              {visitorData.city}, {visitorData.region}
                            </p>
                            <p className="text-sm text-muted-foreground">{visitorData.country}</p>
                          </div>
                        </div>
                      )}
                      {visitorData.org && (
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">ISP</p>
                            <p className="text-base font-medium">{visitorData.org}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Lookup Section */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Lookup IP or Domain
              </CardTitle>
              <CardDescription>Enter any IP address or domain name to get information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g., 8.8.8.8 or google.com"
                  value={lookupInput}
                  onChange={(e) => setLookupInput(e.target.value)}
                  className="flex-1 h-12 text-base"
                  disabled={lookupLoading}
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={lookupLoading || !lookupInput.trim()}
                  className="px-6"
                >
                  {lookupLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Lookup
                    </>
                  )}
                </Button>
              </form>

              {lookupError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {lookupError instanceof Error ? lookupError.message : 'Failed to lookup the provided address. Please check the input and try again.'}
                  </AlertDescription>
                </Alert>
              )}

              {lookupData && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-2xl font-mono font-semibold text-foreground">
                        {lookupData.ip}
                      </p>
                    </div>
                  </div>

                  {showExtraDetails && lookupData.city && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {lookupData.city && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <p className="text-base font-medium">
                              {lookupData.city}, {lookupData.region}
                            </p>
                            <p className="text-sm text-muted-foreground">{lookupData.country}</p>
                          </div>
                        </div>
                      )}
                      {lookupData.org && (
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">ISP</p>
                            <p className="text-base font-medium">{lookupData.org}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Display Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="extra-details" className="text-base font-medium">
                    Show extra details
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display ISP and location information
                  </p>
                </div>
                <Switch
                  id="extra-details"
                  checked={showExtraDetails}
                  onCheckedChange={setShowExtraDetails}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with love using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
