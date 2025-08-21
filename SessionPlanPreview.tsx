  import React from 'react';
  import { useState, useEffect, useRef } from 'react';
  import { useLocation,useNavigate } from 'react-router-dom';
  import CloseIcon from '@mui/icons-material/Close';
  import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
  import LinkIcon from '@mui/icons-material/Link';
  import axios from 'axios';
  import config from '@/config';
  import Header from '@/components/Header';
  import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Link,
    Divider,
    TextField,
    IconButton,
    Button,
    Chip,
    Alert,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress as MuiCircularProgress,
    CardMedia,
    Tooltip
  } from '@mui/material';
  import { 
    Edit as EditIcon, 
    Save as SaveIcon, 
    Delete as DeleteIcon, 
    Add as AddIcon, 
    PlayArrow as PlayArrowIcon 
  } from '@mui/icons-material';
  import { CircularProgress } from '@mui/material';
  import { 
    ArrowLeft, 
    BookOpen, 
    Target, 
    Clock, 
    Users, 
    Video, 
    Globe, 
    FileText, 
    Brain, 
    CheckCircle2, 
    Lightbulb, 
    MessageSquare, 
    TrendingUp,
    Home,
    Edit3,
    Calendar,
    GraduationCap,
    Image,
    Play,
    Activity,
    HelpCircle,
    ChevronRight,
    ExternalLink,
  
  } from 'lucide-react';
  const SessionPlanPreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
    selectedLessonPlan
  } = location.state || {};
    const [selectedPlan, setSelectedPlan] = useState(null);
    React.useEffect(() => {
        if (selectedLessonPlan) {
            setSelectedPlan(selectedLessonPlan);
        } 
      });
    const [failedPreviewImages, setFailedPreviewImages] = useState(new Set());
  return (
      <div className="w-full min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="h-auto p-0 hover:text-foreground"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
            <span>/</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() =>  navigate('/lesson-plan-assistant')}
              className="h-auto p-0 hover:text-foreground"
            >
              Lesson Plan Repository
            </Button>
            <span>/</span>
            <span className="text-foreground">Session Plan Preview</span>
          </div>
  
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lesson Planner
            </Button>
          </div>
      <div className="max-w-7xl mx-auto space-y-6">
  {selectedPlan ? (
  <Box sx={{ p: 1, background: '#fff' }}>
  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
    {selectedPlan?.structuredData?.title}
  </Typography>
  <Box sx={{ display: 'flex', gap: 2, '& .MuiTypography-root': { display: 'inline' }, mb: 1, '& p': { display: 'none' } }}>
    <Typography variant="subtitle2" color="textSecondary" component="span">
      Grade: {selectedPlan?.structuredData?.metadata?.grade || 'Not specified'}
    </Typography>
    <Typography variant="subtitle2" color="textSecondary" component="span">
      • Subject: {selectedPlan?.structuredData?.metadata?.subject || 'Not specified'}
    </Typography>
    <Typography variant="subtitle2" color="textSecondary" component="span">
      • <span>Duration: </span>
      <Box component="span" fontWeight={600} color="text.primary">
        {selectedPlan?.structuredData?.metadata?.duration || 'Not specified'}
      </Box>
    </Typography>
  </Box>

  <Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
    🎯 Learning Objectives
  </Typography>
  {selectedPlan.structuredData.learningObjectives?.length > 0 ? (
    <ul style={{ paddingLeft: '1.2rem' }}>
      {selectedPlan.structuredData.learningObjectives.map((obj, i) => (
        <li key={i}><Typography variant="body2">{obj}</Typography></li>
      ))}
    </ul>
  ) : (
    <Typography color="text.secondary">No learning objectives available</Typography>
  )}
</Box>

<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
    🧪 Materials
  </Typography>
  {selectedPlan.structuredData.materials?.length > 0 ? (
    <Box component="ul" sx={{ pl: 3 }}>
      {selectedPlan.structuredData.materials.map((mat, idx) => (
        <li key={idx}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {mat.name || 'Unnamed material'} {mat.quantity && `— ${mat.quantity}`}
          </Typography>
          {mat.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {mat.notes}
            </Typography>
          )}
        </li>
      ))}
    </Box>
  ) : (
    <Typography color="text.secondary">No materials added</Typography>
  )}
</Box>




<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
    🗣️ Key Vocabulary
  </Typography>
  {selectedPlan.structuredData.keyVocabulary?.length > 0 ? (
    <Box component="ul" sx={{ pl: 3 }}>
      {selectedPlan.structuredData.keyVocabulary.map((word, idx) => (
        <li key={idx} style={{ marginBottom: '1.5rem' }}>
          <Typography variant="body1" sx={{ mb: 0.5 }}>
            <strong>{word.term || 'Untitled Term'}</strong>
            {word.definition && `: ${word.definition}`}
          </Typography>
          {word.example && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem', lineHeight: 1.5, fontStyle: 'italic' }}>
              <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>Example: </Box>
              {word.example}
            </Typography>
          )}
        </li>
      ))}
    </Box>
  ) : (
    <Typography color="text.secondary">No vocabulary terms available</Typography>
  )}
</Box>




<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
    📝 Assessment
  </Typography>

  {selectedPlan.structuredData.assessment?.description ? (
    <Typography variant="body1" sx={{ mb: 1 }}>
      {selectedPlan.structuredData.assessment.description}
    </Typography>
  ) : (
    <Typography color="text.secondary" sx={{ mb: 1 }}>
      No assessment description provided
    </Typography>
  )}

  {selectedPlan.structuredData.assessment?.successCriteria?.length > 0 && (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Success Criteria:</Typography>
      <Box component="ul" sx={{ pl: 3, m: 0, listStyle: 'disc' }}>
        {selectedPlan.structuredData.assessment.successCriteria.map((criteria, index) => (
          <Box component="li" key={index} sx={{ mb: 0.5 }}>
            <Typography variant="body2">{criteria}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )}
</Box>


<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
    ♿ Differentiation
  </Typography>

  {selectedPlan.structuredData.differentiation?.support ? (
    <Typography variant="body1">
      {selectedPlan.structuredData.differentiation.support}
    </Typography>
  ) : (
    <Typography variant="body2" color="text.secondary">
      No support strategies defined
    </Typography>
  )}
</Box>


  
<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1.5 }}>
    🚀 Introduction
  </Typography>

  {selectedPlan.structuredData.lessonFlow?.introduction ? (
    <>
      {selectedPlan.structuredData.lessonFlow.introduction.hook && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Hook:</strong> {selectedPlan.structuredData.lessonFlow.introduction.hook}
        </Typography>
      )}
      {selectedPlan.structuredData.lessonFlow.introduction.priorKnowledge && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Prior Knowledge:</strong> {selectedPlan.structuredData.lessonFlow.introduction.priorKnowledge}
        </Typography>
      )}
      {selectedPlan.structuredData.lessonFlow.introduction.duration && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Duration:</strong> {selectedPlan.structuredData.lessonFlow.introduction.duration}
        </Typography>
      )}
    </>
  ) : (
    <Typography variant="body2" color="textSecondary">
      No introduction provided.
    </Typography>
  )}
</Box>


<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
    🧩 Activities
  </Typography>

  {selectedPlan?.structuredData?.lessonFlow?.activities?.length > 0 ? (
    selectedPlan.structuredData.lessonFlow.activities.map((act, idx) => (
      <Box key={idx} sx={{ mb: 3, pl: 2, borderLeft: '4px solid #eee', backgroundColor: '#fafafa', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
          {act.title || `Activity ${idx + 1}`}
        </Typography>

        {act.duration && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <strong>Duration:</strong> {act.duration} minutes
          </Typography>
        )}

        {act.grouping && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            <strong>Grouping:</strong> {act.grouping}
          </Typography>
        )}

        {act.materials && Array.isArray(act.materials) && act.materials.length > 0 && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Materials:</strong> {act.materials.join(', ')}
          </Typography>
        )}

        {act.objective && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Objective:</strong> {act.objective}
          </Typography>
        )}

        {act.description && act.description.trim() !== '' && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Description:</strong> {act.description}
          </Typography>
        )}

        {act.steps && Array.isArray(act.steps) && act.steps.length > 0 && act.steps.some(step => step.trim() !== '') && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Steps:
            </Typography>
            <Box component="ol" sx={{ pl: 3, mt: 0.5 }}>
              {act.steps.filter(step => step.trim() !== '').map((step, stepIndex) => (
                <li key={stepIndex} style={{ marginBottom: '4px' }}>
                  <Typography variant="body2">{step}</Typography>
                </li>
              ))}
            </Box>
          </Box>
        )}

        {act.teacherNotes && act.teacherNotes.trim() !== '' && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1, 
              fontStyle: 'italic',
              backgroundColor: '#fff3cd',
              p: 1.5,
              borderRadius: 1,
              border: '1px solid #ffeaa7'
            }}
          >
            <strong>📝 Teacher Notes:</strong> {act.teacherNotes}
          </Typography>
        )}
      </Box>
    ))
  ) : (
    <Typography color="text.secondary">No activities available.</Typography>
  )}
</Box>
<Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2, mt: 4 }}>
  🌍 Real World Examples
</Typography>

{Array.isArray(selectedPlan?.structuredData?.realWorldExamples) && selectedPlan.structuredData.realWorldExamples.length > 0 ? (
  <Grid container spacing={2}>
    {selectedPlan.structuredData.realWorldExamples.map((ex, idx) => (
      <Grid  key={idx}>
        <Box
          sx={{
            p: 2,
            border: '1px solid #ddd',
            borderRadius: 2,
            height: '100%',
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {ex.example || 'No example'}
          </Typography>
          {ex.explanation && (
            <Typography variant="body2" color="text.secondary">
              {ex.explanation}
            </Typography>
          )}
        </Box>
      </Grid>
    ))}
  </Grid>
) : (
  <Typography color="text.secondary">No real world examples added yet</Typography>
)}





<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
    💬 Discussion Questions
  </Typography>

  {selectedPlan.structuredData.discussionQuestions?.length > 0 ? (
    selectedPlan.structuredData.discussionQuestions.map((dq, index) => (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Q{index + 1}: {dq.question}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          <strong>Purpose:</strong> {dq.purpose}
        </Typography>
      </Box>
    ))
  ) : (
    <Typography variant="body2" color="textSecondary">No discussion questions available.</Typography>
  )}
</Box>



<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
    📰 Current Affairs
  </Typography>

  {((selectedPlan.structuredData.currentAffairs || selectedPlan.structuredData.additionalSections?.currentAffairs)?.length > 0) ? (
    <Grid container spacing={3}>
      {(selectedPlan.structuredData.currentAffairs || selectedPlan.structuredData.additionalSections?.currentAffairs || []).map((item, index) => (
        <Grid key={item.url || index}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
            <Link href={item.url} target="_blank" rel="noopener noreferrer" underline="hover" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'none' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'inherit' }}>
                {item.title}
              </Typography>
            </Link>
            {item.snippet && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {item.snippet}
              </Typography>
            )}
            {item.date && (
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                {item.date}
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
      No current affairs available
    </Typography>
  )}
</Box>

<Box sx={{ mt: 4 }}>
  <Typography variant="h6" sx={{ 
    fontWeight: 600, 
    mb: 3, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5,
    color: 'black',
    '& span': {
      fontSize: '1.5rem',
      lineHeight: 1
    }
  }}>
    <span>🎬</span>
    Educational Videos
  </Typography>

  {selectedPlan.structuredData.educationalVideos?.length > 0 ? (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
      gap: '24px',
      width: '100%',
      '& > *': {
        width: '100% !important',
        maxWidth: '100% !important',
        margin: '0 !important'
      }
    }}>
      {selectedPlan.structuredData.educationalVideos.map((video, index) => {
        const youtubeMatch = video.url?.match(
          /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
        );
        const thumbnailUrl = youtubeMatch
          ? `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
          : null;

        return (
          <Box key={index} sx={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            },
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'block',
                width: '100%',
                height: '280px',
                cursor: 'pointer'
              }}
            >
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  },
                  '& .play-icon': {
                    transform: 'scale(1.2)'
                  }
                }
              }}>
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={video.title || `Video ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5'
                    }}                   
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f9f9f9',
                      color: '#888',
                      fontStyle: 'italic',
                      fontSize: '0.9rem'
                    }}
                  >
                    Video preview not available
                  </Box>
                )}
                <Box className="play-icon" sx={{
                  position: 'absolute',
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderLeft: '16px solid #1976d2',
                    marginLeft: '4px'
                  }
                }} />
              </Box>
            </a>
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              bgcolor: 'background.paper',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography 
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                  minHeight: '2.6em',
                  color: 'text.primary'
                }}
              >
                {video.title || `Video ${index + 1}`}
              </Typography>
              {video.description && (
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexGrow: 1
                  }}
                >
                  {video.description}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  ) : (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      No educational videos available.
    </Typography>
  )}
</Box>

<Box sx={{ mt: 3 }}>
  <Typography variant="h6" sx={{ 
    fontWeight: 600, 
    mb: 3, 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5,
    color: 'black',
    '& span': {
      fontSize: '1.5rem',
      lineHeight: 1
    }
  }}>
    <span>🖼️</span>
    Visual Aids
  </Typography>
  {selectedPlan.structuredData.visualAids?.filter(aid => aid?.url && !failedPreviewImages.has(aid.url)).length > 0 ? (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
      gap: '24px',
      width: '100%',
      '& > *': {
        width: '100% !important',
        maxWidth: '100% !important',
        margin: '0 !important'
      }
    }}>
      {selectedPlan.structuredData.visualAids
        .filter(aid => aid?.url && !failedPreviewImages.has(aid.url))
        .map((aid, index) => (
          <Box key={index} sx={{
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            },
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <a 
              href={aid.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                display: 'block',
                width: '100%',
                height: '280px',
                cursor: 'pointer'
              }}
            >
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 2,
                '&:hover': {
                  opacity: 0.9
                }
              }}>
                <img
                  src={aid.url}
                  alt={aid.alt_description || 'Visual aid'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    padding: '8px',
                    pointerEvents: 'none'
                  }}
                  onError={() => {
                    setFailedPreviewImages(prev => new Set([...prev, aid.url]));
                  }}
                  loading="lazy"
                />
              </Box>
            </a>
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <Typography 
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                  minHeight: '2.6em',
                  color: 'text.primary'
                }}
              >
                {aid.alt_description || 'Visual Aid'}
              </Typography>
              {aid.source && (
                <Typography 
                  variant="caption" 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    mt: 0.5
                  }}
                >
                  <span style={{ opacity: 0.7 }}>Source:</span>
                  <Box component="span" sx={{ 
                    fontWeight: 500,
                    color: 'primary.main',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}>
                    {new URL(aid.url).hostname.replace('www.', '')}
                  </Box>
                </Typography>
              )}
            </Box>
          </Box>
      ))}
    </Box>
  ) : (
    <Typography variant="body2" color="text.secondary">
      No visual aids available for this lesson.
    </Typography>
  )}
</Box>

<Box sx={{ mt: 4, mb: 3 }}>
  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2, display: 'flex', alignItems: 'center' }}>
    <span role="img" aria-label="Resources" style={{ marginRight: '8px' }}>📚</span>
    Educational Documents
  </Typography>
  
  <Box sx={{ 
    backgroundColor: '#f8f9fa', 
    borderRadius: 2, 
    p: 3,
    border: '1px solid #e0e0e0',
    mb: 4
  }}>
    {selectedPlan.structuredData.resources?.length > 0 ? (
      <Grid container spacing={3}>
        {selectedPlan.structuredData.resources.map((resource, index) => (
          <Grid  key={index}>
            <Box 
              component="a"
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: 'white',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                  textDecoration: 'none'
                }
              }}
            >
              <Box sx={{ 
                p: 2,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  {(resource.url || '').toLowerCase().endsWith('.pdf') ? (
                    <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                  ) : (
                    <LinkIcon color="primary" sx={{ mr: 1 }} />
                  )}
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      color: (resource.url || '').toLowerCase().endsWith('.pdf') ? '#d32f2f' : 'primary.main',
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {(resource.url || '').toLowerCase().endsWith('.pdf') ? 'PDF' : 'Web Resource'}
                  </Typography>
                </Box>
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {resource.title || 'Untitled Resource'}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontSize: '0.875rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minHeight: '3.5em'
                  }}
                >
                  {resource.description || 'No description available'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    ) : (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        color: 'text.secondary',
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px dashed #e0e0e0'
      }}>
        <LinkIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
        <Typography variant="body1">No educational resources available</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>We couldn't find any resources for this topic.</Typography>
      </Box>
    )}
  </Box>
</Box>

</Box>

) : (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <CircularProgress />
    <Typography variant="body1" sx={{ mt: 2 }}>
      Loading lesson plan...
    </Typography>
  </Box>
)}
</div>
 </div>
     </div>

  );
}
export default SessionPlanPreview;