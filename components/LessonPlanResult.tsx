
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Target, Clock, Users, Video, Globe, FileText, Brain, CheckCircle2, Lightbulb, MessageSquare, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';

interface LessonPlanResultProps {
  lessonData: {
    grade: string;
    subject: string;
    lessonName: string;
  };
  onBack: () => void;
}

const LessonPlanResult = ({ lessonData, onBack }: LessonPlanResultProps) => {
  const activities = [
    {
      title: "Opening Minds",
      description: "Students will brainstorm what they already know about climate change and share their ideas.",
      duration: "10 minutes"
    },
    {
      title: "Core Learning", 
      description: "Teacher will present the concept of greenhouse gases and their role in climate change using interactive diagrams.",
      duration: "20 minutes"
    },
    {
      title: "Hands-On Exploration",
      description: "Students will conduct a simple experiment to demonstrate the greenhouse effect using clear containers.",
      duration: "25 minutes"
    },
    {
      title: "Group Discussion",
      description: "Students will work in small groups to discuss the impact of climate change on their local community.",
      duration: "15 minutes"
    }
  ];

  const realWorldExamples = [
    "Melting polar ice caps and rising sea levels",
    "Extreme weather events like hurricanes and droughts", 
    "Changes in animal migration patterns",
    "Impact on agriculture and food production"
  ];

  const discussionQuestions = [
    "What can we do in our daily lives to reduce our carbon footprint?",
    "How might climate change affect our local community in the next 20 years?",
    "What role do governments and businesses play in addressing climate change?",
    "How can renewable energy sources help combat climate change?"
  ];

  const currentEvents = [
    "Recent climate summit agreements and commitments",
    "New renewable energy projects in our region",
    "Local environmental conservation efforts",
    "Youth climate activism movements"
  ];

  const educationalVideos = [
    {
      title: "Climate Change: The Greenhouse Effect",
      source: "National Geographic Kids",
      duration: "5 minutes"
    },
    {
      title: "Understanding Global Warming", 
      source: "NASA Climate Kids",
      duration: "8 minutes"
    },
    {
      title: "Renewable Energy Solutions",
      source: "TED-Ed",
      duration: "6 minutes"
    }
  ];

  const resources = [
    {
      title: "Climate Change: The Greenhouse Effect",
      type: "Video",
      source: "National Geographic Kids"
    },
    {
      title: "Understanding Global Warming",
      type: "Interactive",
      source: "NASA Climate Kids"
    },
    {
      title: "Carbon Footprint Calculator",
      type: "Tool", 
      source: "EPA"
    },
    {
      title: "Climate Change Basics",
      type: "Article",
      source: "NOAA Climate.gov"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Lesson Planner
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">{lessonData.lessonName}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Grade {lessonData.grade}</Badge>
                    <Badge variant="outline">{lessonData.subject}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  60 minutes
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will understand the basic concept of climate change and its causes.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will identify greenhouse gases and explain their role in global warming.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will demonstrate understanding through hands-on experiments and discussions.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <p>Students will analyze real-world examples of climate change impacts.</p>
              </div>
            </CardContent>
          </Card>

          {/* Mathematical Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Mathematical Link Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Students will analyze temperature data graphs, calculate percentage increases in CO2 levels, 
                and interpret statistical information about climate trends over the past century. They will 
                work with data visualization and mathematical modeling concepts.
              </p>
            </CardContent>
          </Card>

          {/* Key Vocabulary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Key Vocabulary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Climate Change', 'Greenhouse Effect', 'Carbon Dioxide', 'Global Warming', 'Fossil Fuels', 'Renewable Energy', 'Carbon Footprint', 'Sustainability'].map((term) => (
                  <Badge key={term} variant="outline" className="justify-center py-2">
                    {term}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Climate change is one of the most pressing issues of our time. This lesson will help students understand 
                the science behind climate change, its causes, and its impacts on our planet. Through engaging activities 
                and discussions, students will explore how human activities contribute to climate change and what we can 
                do to address this global challenge.
              </p>
              <p className="text-muted-foreground">
                Students will begin by sharing their prior knowledge and then dive deep into the greenhouse effect, 
                examining data and conducting experiments to solidify their understanding.
              </p>
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{activity.title}</h4>
                    <Badge variant="secondary">{activity.duration}</Badge>
                  </div>
                  <p className="text-muted-foreground">{activity.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real World Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Real World Examples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {realWorldExamples.map((example, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <span className="text-muted-foreground">{example}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Discussion Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Discussion Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {discussionQuestions.map((question, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-semibold text-sm">Q{index + 1}:</span>
                    <span className="text-muted-foreground">{question}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Current Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Current Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentEvents.map((event, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5" />
                    <span className="text-muted-foreground">{event}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Educational Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Educational Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {educationalVideos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{video.title}</h4>
                      <p className="text-sm text-muted-foreground">Source: {video.source}</p>
                    </div>
                    <Badge variant="outline">{video.duration}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Formative Assessment</h4>
                <p className="text-muted-foreground">
                  Observe student participation during discussions and hands-on activities. 
                  Use exit tickets to assess understanding of key concepts. Monitor group work 
                  and provide feedback during experimental activities.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Summative Assessment</h4>
                <p className="text-muted-foreground">
                  Students will create a poster or digital presentation explaining one solution to climate change, 
                  demonstrating their understanding of the topic. Assessment will include accuracy of scientific 
                  concepts, creativity, and ability to communicate solutions effectively.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Differentiation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Differentiation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold">For Advanced Learners:</h4>
                <p className="text-muted-foreground">Research specific climate change impacts in different regions of the world. Analyze complex climate data and create predictive models.</p>
              </div>
              <div>
                <h4 className="font-semibold">For Struggling Learners:</h4>
                <p className="text-muted-foreground">Provide simplified diagrams and one-on-one support during activities. Use graphic organizers to help structure learning.</p>
              </div>
              <div>
                <h4 className="font-semibold">For ELL Students:</h4>
                <p className="text-muted-foreground">Include visual aids and bilingual resources where available. Pair with bilingual peers for support.</p>
              </div>
            </CardContent>
          </Card>

          {/* Educational Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Educational Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">Source: {resource.source}</p>
                    </div>
                    <Badge variant="outline">{resource.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-6">
            <Button variant="outline" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button size="lg">
              <BookOpen className="h-4 w-4 mr-2" />
              Save to Repository
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanResult;
