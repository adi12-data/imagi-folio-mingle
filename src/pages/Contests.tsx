
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';

const Contests: React.FC = () => {
  const contests = [
    {
      id: 1,
      title: "Ghibli Dreamscapes",
      description: "Transform your photos into magical Ghibli-style landscapes",
      deadline: "2023-08-15",
      participants: 128,
      status: "active",
      prize: "Premium subscription for 1 year",
    },
    {
      id: 2,
      title: "Night Vision Challenge",
      description: "Show off your best low-light enhancements",
      deadline: "2023-08-05",
      participants: 86,
      status: "active",
      prize: "Featured on homepage for 1 week",
    },
    {
      id: 3,
      title: "Vintage Vibes",
      description: "Transform modern photos into nostalgic vintage memories",
      deadline: "2023-07-25",
      participants: 214,
      status: "completed",
      winner: {
        username: "retrovisionary",
        image: "/placeholder.svg",
      },
      prize: "Premium subscription for 6 months",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Transformation Contests</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Card key={contest.id} className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{contest.title}</CardTitle>
                  <Badge variant={contest.status === "active" ? "default" : "secondary"}>
                    {contest.status === "active" ? "Active" : "Completed"}
                  </Badge>
                </div>
                <CardDescription>{contest.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                {contest.status === "active" ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{new Date(contest.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participants:</span>
                      <span>{contest.participants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prize:</span>
                      <span>{contest.prize}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <div className="relative mb-2">
                      <Trophy className="h-8 w-8 text-highlight-yellow mb-1" />
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src={contest.winner?.image} />
                        <AvatarFallback>{contest.winner?.username?.[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <p className="text-sm font-medium">{contest.winner?.username}</p>
                    <p className="text-xs text-muted-foreground">Winner</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant={contest.status === "active" ? "default" : "outline"} 
                  className="w-full"
                >
                  {contest.status === "active" ? "Participate Now" : "View Results"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">About our Contests</h2>
          <p className="text-muted-foreground mb-6">
            Contests are a fun way to showcase your transformation skills and win exciting prizes. 
            Each contest has a specific theme and transformation style. Participate by creating 
            transformations that match the contest theme and submit your entries before the deadline.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-md font-medium mb-2">How to Participate</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create a new transformation</li>
                <li>Select the contest theme</li>
                <li>Submit your entry before the deadline</li>
                <li>Get votes from the community</li>
              </ol>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-md font-medium mb-2">Judging Criteria</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Creativity and originality</li>
                <li>• Technical quality of the transformation</li>
                <li>• Relevance to the contest theme</li>
                <li>• Community votes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contests;
