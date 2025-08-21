import React, { useState, useRef } from 'react';
import config from '@/config.js';
import { ArrowLeft, Home, Video, Upload, Plus, Play, Pause, Download, Trash2, GripVertical, Link, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { PageLoader } from '@/components/ui/loader';
import { set } from 'date-fns';

interface VideoClip {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  source: 'youtube' | 'upload';
  url?: string;
  file?: File;
  blob?: Blob;
  videoSrc: string       // URL for previewing the clip
  backendVideoPath: string // Path for backend processing
  clipPath: string       // Path to the saved clip file
  clipFile:string
}

const VideoClipEditor = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalYoutubeUrl, setModalYoutubeUrl] = useState('');
  const [modalActiveTab, setModalActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [backendVideoPath, setBackendVideoPath] = useState('');
  const [videoSrc, setVideoSrc] = useState('');

 
  const BACKEND ="https://ai.excelsoftcorp.com/aiapps/VIDEOTRIM";
  const handleYouTubeLoad = async() => {
    setIsLoading(true);
    if (!youtubeUrl) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }
    const formData = new FormData();
    formData.append("youtube_url", youtubeUrl);
    try{
      const res = await axios.post(`${BACKEND}/upload`, formData);
      setBackendVideoPath(res.data.video_path);
      //const videoUrl = res.data.video_path;
      //setCurrentVideo(youtubeUrl);
      setCurrentVideo(`${BACKEND}/video?video_path=${encodeURIComponent(res.data.video_path)}.mp4`);
      setIsLoading(false);
      toast.success('YouTube video loaded successfully');
      setIsModalOpen(false);
      setModalYoutubeUrl('');
    }
    catch(e){
      setIsLoading(false);
      toast.error('Failes to load YouTube video');
    }
    
    
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setIsLoading(true);
      setUploadedFile(file);
      const videoUrl = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append("file", file);
      try{
        const res = await axios.post(`${BACKEND}/upload`, formData);
        setBackendVideoPath(res.data.video_path);
        setCurrentVideo(`${BACKEND}/video?video_path=${encodeURIComponent(res.data.video_path)}`)        
        setIsModalOpen(false);
        setModalYoutubeUrl('');
        setIsLoading(false);
        toast.success('Video file uploaded successfully');
      }
      catch(e){
        setIsLoading(false);
        toast.error('Failed to upload video file');
      }
      //setCurrentVideo(videoUrl);
      
    } else {
      toast.error('Please select a valid video file');
    }
  };

  /*const handleModalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setCurrentVideo(videoUrl);
      setIsModalOpen(false);
      setModalYoutubeUrl('');
      toast.success('Video file uploaded successfully');
    } else {
      toast.error('Please select a valid video file');
    }
  };*/

  /*const handleModalYouTubeLoad = () => {
    if (!modalYoutubeUrl) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    const videoId = extractYouTubeVideoId(modalYoutubeUrl);
    if (!videoId) {
      toast.error('Invalid YouTube URL');
      return;
    }
    
    setCurrentVideo(modalYoutubeUrl);
    setIsModalOpen(false);
    setModalYoutubeUrl('');
    toast.success('YouTube video loaded successfully');
  };*/

  const previewClipInDialog = (clip: VideoClip) => {
    if (videoRef.current) {
      videoRef.current.currentTime = clip.startTime
    }
  }

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setTrimEnd(videoDuration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const saveClip = async() => {
    if (!currentVideo) {
      toast.error('No video loaded');
      return;
    }

    if (trimStart >= trimEnd) {
      toast.error('Invalid trim range');
      return;
    }
    
    const formData = new FormData()
    formData.append('start_time',trimStart.toString())
    formData.append('end_time', trimEnd.toString())
    formData.append('video_path', backendVideoPath) // ensure this is the correct path

    try{
      setIsLoading(true);
      const res = await axios.post(`${BACKEND}/saveClip`, formData);
      const newClip: VideoClip = {
        id: Date.now().toString(),
        name: `Clip ${clips.length + 1}`,
        duration: trimEnd - trimStart,
        startTime: trimStart,
        endTime: trimEnd,
        source: activeTab,
        url: activeTab === 'youtube' ? youtubeUrl : undefined,
        file: activeTab === 'upload' ? uploadedFile : undefined,
        videoSrc,                // <- Current videoSrc
        backendVideoPath,
        clipPath: `${BACKEND}/video?video_path=${encodeURIComponent(res.data.clip_path)}`, // <- Path returned from backend
        clipFile: res.data.clip_path // <- Path to the saved clip file
      };
      setClips([...clips, newClip]);
      setIsLoading(false)
      toast.success('Clip saved successfully');
    }
    catch(e){
      setIsLoading(false)
      toast.error('Failed to save clip');
    }
  };

  const deleteClip = (clipId: string) => {
    //setClips(clips.filter(clip => clip.id !== clipId));
    const updatedClips = clips.filter(clip => clip.id !== clipId)

    const renamedClips = updatedClips.map((clip, index) => ({
      ...clip,
      name: "Clip "+(index + 1).toString(), // or use 'id' if that's what you want to rename
    }));
    setClips(renamedClips)
    toast.success('Clip deleted');
  };

  const moveClip = (clipId: string, direction: 'up' | 'down') => {
    const currentIndex = clips.findIndex(clip => clip.id === clipId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= clips.length) return;

    const newClips = [...clips];
    [newClips[currentIndex], newClips[newIndex]] = [newClips[newIndex], newClips[currentIndex]];
    setClips(newClips);
  };

  const downloadAllClips = async () => {
    if (clips.length === 0) {
      toast.error('No clips to download');
      return;
    }
    try{
      const formData = new FormData();
      formData.append("clips", JSON.stringify(clips));
      const res = await axios.post(`${BACKEND}/process`, formData);

      const downloadUrl = `${BACKEND}${res.data.download_url}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "combined_video.mp4";
      link.click();
      toast.success('Download feature would merge and download all clips');
      setClips([]);
      setCurrentVideo(null);
    }
    catch (e){
      toast.error('Failed to download clips');
    }
    
    // In a real implementation, this would use FFmpeg.js or similar to merge clips
    //toast.success('Download feature would merge and download all clips');
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span className="mx-2">/</span>
            <span className="text-gray-700">Teacher Tools</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Video Clip Editor</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center">
                  <Video className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Video Clip Editor</h1>
                  <p className="text-sm text-gray-500">Create and edit video clips</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Video Input and Player Section - Full Width */}
        <div className="mb-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'youtube' | 'upload')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-auto bg-gray-100 p-1 rounded-2xl">
                  <TabsTrigger 
                    value="youtube" 
                    className="flex items-center gap-3 h-14 px-6 rounded-xl transition-all font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800"
                  >
                    <Link className="w-4 h-4" />
                    Paste YouTube URL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upload" 
                    className="flex items-center gap-3 h-14 px-6 rounded-xl transition-all font-medium text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Video File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="youtube" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="youtube-url">YouTube URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="youtube-url"
                        placeholder="Paste YouTube URL here..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleYouTubeLoad} className="bg-cyan-500 hover:bg-cyan-600">
                        Load Video
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-upload">Upload Video File</Label>
                    <div className="flex flex-col gap-4">
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-400 mt-1">MP4, MOV, AVI files supported</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {uploadedFile && (
                        <p className="text-sm text-green-600">
                          Selected: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      Clip from a New Video
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsModalOpen(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Video Source</h3>
                      
                      <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                        <Button
                          variant={modalActiveTab === 'youtube' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setModalActiveTab('youtube')}
                          className="flex-1 h-10"
                        >
                          YouTube URL
                        </Button>
                        <Button
                          variant={modalActiveTab === 'upload' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setModalActiveTab('upload')}
                          className="flex-1 h-10"
                        >
                          Upload File
                        </Button>
                      </div>
                      
                      {modalActiveTab === 'youtube' ? (
                        <div className="space-y-4">
                          <Input
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={modalYoutubeUrl}
                            onChange={(e) => setModalYoutubeUrl(e.target.value)}
                            className="w-full"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleYouTubeLoad}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                            >
                              Load Video
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsModalOpen(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                            onClick={() => modalFileInputRef.current?.click()}
                          >
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload a video file</p>
                            <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI supported</p>
                          </div>
                          <input
                            ref={modalFileInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Video Player */}
          {currentVideo && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Video Editor</CardTitle>
                  {/*
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add clip from new video
                        </Button>
                      </DialogTrigger>
                    </Dialog>*/
                  }
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden" style={
                    {
                      width:'65%',
                      marginLeft:'auto',
                      marginRight:'auto'
                    }
                  }>
                    <video
                      ref={videoRef}
                      src={currentVideo}
                      onLoadedMetadata={handleVideoLoadedMetadata}
                      onTimeUpdate={handleTimeUpdate}
                      className="w-full h-auto max-h-96"
                      controls={false}
                    />
                  </div>

                  {/* Video Controls */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={togglePlayPause}
                        className="h-10 px-4"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                        <span className="text-sm font-mono text-gray-700">
                          {formatTime(currentTime)}
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="text-sm font-mono text-gray-500">
                          {formatTime(duration)}
                        </span>
                      </div>
                    </div>

                    {/* Enhanced Timeline */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Timeline & Trim Controls</Label>
                      
                      {/* Main Timeline Container */}
                      <div className="relative bg-gray-100 rounded-lg p-4">
                        {/* Timeline Track */}
                        <div className="relative h-12 bg-gray-200 rounded-md overflow-hidden">
                          {/* Full timeline background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                          
                          {/* Selected region highlight */}
                          <div 
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80"
                            style={{
                              left: `${(trimStart / duration) * 100}%`,
                              width: `${((trimEnd - trimStart) / duration) * 100}%`
                            }}
                          ></div>
                          
                          {/* Current playhead */}
                          <div 
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-lg z-20"
                            style={{
                              left: `${(currentTime / duration) * 100}%`
                            }}
                          >
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md"></div>
                          </div>
                          
                          {/* Start handle */}
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-cyan-600 cursor-ew-resize hover:bg-cyan-700 transition-colors z-10 group"
                            style={{
                              left: `${(trimStart / duration) * 100}%`
                            }}
                            onMouseDown={(e) => {
                              const startX = e.clientX;
                              const startValue = trimStart;
                              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                if (!rect) return;
                                const newValue = Math.max(0, Math.min(trimEnd - 0.1, startValue + ((e.clientX - startX) / rect.width) * duration));
                                setTrimStart(newValue);
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          >
                            <div className="absolute -top-1 -left-1 w-3 h-14 bg-cyan-600 rounded border border-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></div>
                            </div>
                          </div>
                          
                          {/* End handle */}
                          <div 
                            className="absolute top-0 bottom-0 w-1 bg-cyan-600 cursor-ew-resize hover:bg-cyan-700 transition-colors z-10 group"
                            style={{
                              left: `${(trimEnd / duration) * 100}%`
                            }}
                            onMouseDown={(e) => {
                              const startX = e.clientX;
                              const startValue = trimEnd;
                              const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                if (!rect) return;
                                const newValue = Math.min(duration, Math.max(trimStart + 0.1, startValue + ((e.clientX - startX) / rect.width) * duration));
                                setTrimEnd(newValue);
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          >
                            <div className="absolute -top-1 -left-1 w-3 h-14 bg-cyan-600 rounded border border-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded"></div>
                            </div>
                          </div>
                          
                          {/* Clickable timeline for seeking */}
                          <div 
                            className="absolute inset-0 cursor-pointer"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const clickPosition = (e.clientX - rect.left) / rect.width;
                              const newTime = clickPosition * duration;
                              handleSeek(newTime);
                            }}
                          ></div>
                        </div>
                        
                        {/* Time markers */}
                        <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                          <span>0:00</span>
                          <span>{formatTime(duration / 4)}</span>
                          <span>{formatTime(duration / 2)}</span>
                          <span>{formatTime(3 * duration / 4)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* Trim Values Display */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg border p-3">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">Start Time</Label>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-lg font-mono font-medium text-cyan-600">
                              {formatTime(trimStart)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSeek(trimStart)}
                              className="text-xs"
                            >
                              Jump to
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border p-3">
                          <Label className="text-xs text-gray-500 uppercase tracking-wide">End Time</Label>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-lg font-mono font-medium text-cyan-600">
                              {formatTime(trimEnd)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSeek(trimEnd)}
                              className="text-xs"
                            >
                              Jump to
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Clip Duration & Save */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs text-green-600 uppercase tracking-wide">Clip Duration</Label>
                            <div className="text-xl font-mono font-bold text-green-700 mt-1">
                              {formatTime(trimEnd - trimStart)}
                            </div>
                          </div>
                          <Button 
                            onClick={saveClip}
                            className="bg-green-500 hover:bg-green-600 px-6"
                            disabled={trimStart >= trimEnd}
                          >
                            Save Clip
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Saved Clips Section - Full Width at Bottom */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Clips ({clips.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {clips.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No clips saved yet</p>
                <p className="text-sm">Create clips from your video above</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 truncate">{clip.name}</h4>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveClip(clip.id, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <GripVertical className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteClip(clip.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3 text-sm">
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Duration</span>
                          <div className="font-mono font-medium text-cyan-600">
                            {formatTime(clip.duration)}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Source</span>
                          <div className="font-medium text-gray-700">
                            {clip.source === 'youtube' ? 'YouTube' : 'Upload'}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Time Range</span>
                          <div className="font-mono text-sm text-gray-700">
                            {formatTime(clip.startTime)} → {formatTime(clip.endTime)}
                          </div>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full hover:bg-cyan-50 hover:border-cyan-300"
                            onClick={() => previewClipInDialog(clip)}
                          >
                            <Play className="w-3 h-3 mr-2" />
                            Preview Clip
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Preview Clip</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <video
                              src={clip.clipPath}
                              className="w-full rounded-lg"
                              controls
                            />
                            <p className="text-sm text-gray-600">
                              Clip: {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
                
                {/* Action Bar at bottom */}
                <div className="border-t pt-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Ready to Export</h3>
                        <p className="text-gray-600">
                          {clips.length} clip{clips.length !== 1 ? 's' : ''} will be merged into one video
                        </p>
                      </div>
                      <Button
                        onClick={downloadAllClips}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-3"
                        size="lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {isLoading && (
        <PageLoader text="Loading ....." />
      )}
    </div>
  );
};

export default VideoClipEditor;