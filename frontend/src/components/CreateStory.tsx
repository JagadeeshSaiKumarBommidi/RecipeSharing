import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Camera, Type, Image as ImageIcon, Save, Send, Video, Circle } from 'lucide-react';

interface CreateStoryProps {
  onClose: () => void;
  onStoryCreated?: () => void;
}

type StoryMode = 'camera' | 'text' | 'upload';
type CameraMode = 'photo' | 'video';

export const CreateStory: React.FC<CreateStoryProps> = ({ onClose, onStoryCreated }) => {
  const [mode, setMode] = useState<StoryMode>('camera');
  const [cameraMode, setCameraMode] = useState<CameraMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#1e293b');
  const [fontSize, setFontSize] = useState(24);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Remove unused user variable for now
  // const { user } = useAuth();

  const backgroundColors = [
    '#1e293b', '#7c3aed', '#dc2626', '#059669', '#d97706',
    '#0ea5e9', '#e11d48', '#8b5cf6', '#10b981', '#f59e0b'
  ];

  const textColors = [
    '#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981',
    '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        publishStory();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: 'user', width: 720, height: 1280 },
        audio: cameraMode === 'video'
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
      setMode('text');
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedMedia(dataUrl);
    setMediaType('photo');
  }, []);

  const startRecording = useCallback(() => {
    if (!stream) return;
    
    chunksRef.current = [];
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setCapturedMedia(url);
      setMediaType('video');
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
    
    // Auto-stop after 15 seconds (Instagram story limit)
    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }, 15000);
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedMedia(result);
      setMediaType(file.type.startsWith('video/') ? 'video' : 'photo');
    };
    reader.readAsDataURL(file);
  };

  const saveToDevice = () => {
    if (!capturedMedia) return;
    
    const link = document.createElement('a');
    link.href = capturedMedia;
    link.download = `story_${Date.now()}.${mediaType === 'video' ? 'mp4' : 'jpg'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const publishStory = async () => {
    if (!capturedMedia && !text) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      if (mode === 'text' && text) {
        // For text stories, just send the text and styling
        formData.append('content', text);
        formData.append('backgroundColor', backgroundColor);
        formData.append('textColor', textColor);
        formData.append('fontSize', fontSize.toString());
        formData.append('textAlign', textAlign);
        formData.append('type', 'text');
      } else if (capturedMedia) {
        // For media stories
        if (capturedMedia.startsWith('data:')) {
          // Convert data URL to blob
          const response = await fetch(capturedMedia);
          const blob = await response.blob();
          formData.append('media', blob, `story.${mediaType === 'video' ? 'mp4' : 'jpg'}`);
        }
        
        formData.append('content', text || ''); // Add any text overlay
        formData.append('type', 'media');
      }
      
      const response = await fetch('http://localhost:5000/api/stories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (response.ok) {
        onStoryCreated?.();
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create story');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const retake = () => {
    setCapturedMedia(null);
    setMediaType(null);
    if (mode === 'camera') {
      startCamera();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-full max-h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('camera')}
              className={`p-2 rounded-full transition-colors ${
                mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'
              }`}
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMode('text')}
              className={`p-2 rounded-full transition-colors ${
                mode === 'text' ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'
              }`}
            >
              <Type className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full transition-colors ${
                mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full flex flex-col">
          {mode === 'camera' && !capturedMedia && (
            <div className="flex-1 relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Camera Controls */}
              <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center space-x-8">
                <button
                  onClick={() => setCameraMode(cameraMode === 'photo' ? 'video' : 'photo')}
                  className="text-white text-sm font-medium"
                >
                  {cameraMode === 'photo' ? 'PHOTO' : 'VIDEO'}
                </button>
                
                <button
                  onClick={cameraMode === 'photo' ? capturePhoto : isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center ${
                    isRecording ? 'bg-red-600' : 'bg-transparent'
                  }`}
                >
                  {cameraMode === 'photo' ? (
                    <Circle className="w-8 h-8 text-white fill-current" />
                  ) : isRecording ? (
                    <div className="w-6 h-6 bg-white rounded-sm" />
                  ) : (
                    <Video className="w-8 h-8 text-white" />
                  )}
                </button>
                
                <div className="w-12" /> {/* Spacer */}
              </div>
              
              {isRecording && (
                <div className="absolute top-20 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recording...
                </div>
              )}
            </div>
          )}

          {mode === 'text' && (
            <div className="flex-1 relative" style={{ backgroundColor }}>
              <div className="h-full flex items-center justify-center p-8">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your story..."
                  className="w-full bg-transparent text-center resize-none outline-none"
                  style={{
                    color: textColor,
                    fontSize: `${fontSize}px`,
                    textAlign,
                    lineHeight: 1.2
                  }}
                  rows={6}
                />
              </div>
              
              {/* Text Controls */}
              <div className="absolute bottom-20 left-0 right-0 p-4 space-y-4">
                {/* Background Colors */}
                <div className="flex justify-center space-x-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-8 h-8 rounded-full ${
                        backgroundColor === color ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                {/* Text Colors */}
                <div className="flex justify-center space-x-2">
                  {textColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-6 h-6 rounded-full border ${
                        textColor === color ? 'ring-2 ring-white' : 'border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                {/* Font Size & Alignment */}
                <div className="flex justify-center items-center space-x-4">
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-24"
                  />
                  <div className="flex space-x-2">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => setTextAlign(align)}
                        className={`px-3 py-1 text-sm rounded ${
                          textAlign === align ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'
                        }`}
                      >
                        {align.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {capturedMedia && (
            <div className="flex-1 relative">
              {mediaType === 'photo' ? (
                <img
                  src={capturedMedia}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={capturedMedia}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Action Buttons */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-6">
                <button
                  onClick={retake}
                  className="px-6 py-2 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-colors"
                >
                  Retake
                </button>
                <button
                  onClick={saveToDevice}
                  className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                >
                  <Save className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={publishStory}
            disabled={isLoading || (!capturedMedia && !text)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{isLoading ? 'Sharing...' : 'Share to Story'}</span>
          </button>
          
          {/* Instructions */}
          <p className="text-center text-white/70 text-xs mt-2">
            {mode === 'camera' && !capturedMedia && (
              cameraMode === 'photo' ? 'Tap the circle to take a photo' : 'Tap to start/stop recording'
            )}
            {mode === 'text' && 'Type your message and tap Share to Story'}
            {capturedMedia && 'Review your story and tap Share to Story'}
          </p>
        </div>

        {/* Hidden Elements */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
