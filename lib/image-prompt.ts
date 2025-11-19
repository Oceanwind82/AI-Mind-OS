import { OpenAI } from 'openai';

// Initialize OpenAI client for image capabilities
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export interface ImagePromptSettings {
  model: 'dall-e-2' | 'dall-e-3';
  size: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  style: 'vivid' | 'natural';
  n: number; // Number of images to generate (1-10 for DALL-E 2, 1 for DALL-E 3)
}

export interface ImageAnalysisOptions {
  maxTokens?: number;
  detail?: 'low' | 'high' | 'auto';
  systemPrompt?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: 'educational' | 'creative' | 'technical' | 'business' | 'marketing';
  template: string;
  description: string;
  variables: string[];
  examples: Array<{
    input: Record<string, string>;
    output: string;
  }>;
}

export interface ImageInteraction {
  id: string;
  userId: string;
  type: 'image-generation' | 'image-analysis' | 'prompt-engineering' | 'visual-learning';
  prompt: string;
  imageUrl?: string;
  analysisResult?: string;
  generatedImages?: string[];
  settings: Partial<ImagePromptSettings>;
  timestamp: Date;
  lessonContext?: {
    lessonSlug: string;
    sectionTitle: string;
  };
  promptTemplate?: string;
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comment?: string;
  };
}

interface ImageAnalytics {
  totalGenerations: number;
  totalAnalyses: number;
  popularTemplates: Array<{ template: string; usage: number }>;
  averageRating: number;
  styleDistribution: Record<string, number>;
  sizeDistribution: Record<string, number>;
  categoryUsage: Record<string, number>;
}

class ImagePromptService {
  private static instance: ImagePromptService;
  private interactions: ImageInteraction[] = [];
  private promptTemplates: PromptTemplate[] = [];

  static getInstance(): ImagePromptService {
    if (!ImagePromptService.instance) {
      ImagePromptService.instance = new ImagePromptService();
      ImagePromptService.instance.initializeTemplates();
    }
    return ImagePromptService.instance;
  }

  // Generate images from text prompts with AI optimization
  async generateImage(
    prompt: string,
    settings: Partial<ImagePromptSettings> = {},
    context?: { lessonSlug: string; sectionTitle: string }
  ): Promise<{
    images: string[];
    optimizedPrompt: string;
    interaction: ImageInteraction;
  }> {
    if (!openai) {
      throw new Error('OpenAI API key not configured for image generation');
    }

    const imageSettings: ImagePromptSettings = {
      model: settings.model || 'dall-e-3',
      size: settings.size || '1024x1024',
      quality: settings.quality || 'standard',
      style: settings.style || 'natural',
      n: settings.n || 1
    };

    try {
      // Optimize prompt for better image generation
      const optimizedPrompt = await this.optimizeImagePrompt(prompt, context);
      
      const response = await openai.images.generate({
        model: imageSettings.model,
        prompt: optimizedPrompt,
        size: imageSettings.size,
        quality: imageSettings.quality,
        style: imageSettings.style,
        n: imageSettings.n,
        response_format: 'url'
      });

      const images = response.data?.map(img => img.url).filter(Boolean) as string[] || [];

      // Create interaction record
      const interaction: ImageInteraction = {
        id: `img_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current-user', // Replace with actual user ID
        type: 'image-generation',
        prompt: optimizedPrompt,
        generatedImages: images,
        settings: imageSettings,
        timestamp: new Date(),
        lessonContext: context
      };

      this.interactions.push(interaction);

      // Track analytics
      this.trackImageAnalytics('image_generated', {
        model: imageSettings.model,
        size: imageSettings.size,
        style: imageSettings.style,
        promptLength: prompt.length,
        imageCount: images.length,
        lessonContext: context
      });

      return {
        images,
        optimizedPrompt,
        interaction
      };
    } catch (error) {
      console.error('Image Generation Error:', error);
      throw new Error('Failed to generate image. Please try refining your prompt.');
    }
  }

  // Analyze uploaded images with AI vision
  async analyzeImage(
    imageUrl: string,
    analysisPrompt: string = "Describe this image in detail, focusing on educational content and key visual elements.",
    options: ImageAnalysisOptions = {}
  ): Promise<{
    analysis: string;
    insights: string[];
    educationalValue: number;
    interaction: ImageInteraction;
  }> {
    if (!openai) {
      throw new Error('OpenAI API key not configured for image analysis');
    }

    try {
      const systemPrompt = options.systemPrompt || 
        `You are an expert image analyst specializing in educational content. Analyze images for:
        1. Educational value and learning potential
        2. Key visual elements and concepts
        3. Practical applications in AI/ML education
        4. Suggestions for improvement or usage
        
        Provide detailed, actionable insights.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: options.detail || 'high'
                }
              }
            ]
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: 0.3
      });

      const analysis = response.choices[0]?.message?.content || 'Unable to analyze image.';
      
      // Extract key insights from analysis
      const insights = this.extractInsights(analysis);
      
      // Calculate educational value score
      const educationalValue = this.calculateEducationalValue(analysis);

      // Create interaction record
      const interaction: ImageInteraction = {
        id: `img_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current-user',
        type: 'image-analysis',
        prompt: analysisPrompt,
        imageUrl,
        analysisResult: analysis,
        settings: {},
        timestamp: new Date()
      };

      this.interactions.push(interaction);

      // Track analytics
      this.trackImageAnalytics('image_analyzed', {
        analysisLength: analysis.length,
        educationalValue,
        insightCount: insights.length
      });

      return {
        analysis,
        insights,
        educationalValue,
        interaction
      };
    } catch (error) {
      console.error('Image Analysis Error:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  // Create visual learning materials from lesson content
  async createVisualLearningMaterial(
    lessonContent: string,
    lessonContext: { lessonSlug: string; sectionTitle: string },
    materialType: 'diagram' | 'infographic' | 'concept-map' | 'flowchart' | 'illustration' = 'diagram'
  ): Promise<{
    visualPrompt: string;
    generatedImages: string[];
    description: string;
    usageGuide: string;
    interaction: ImageInteraction;
  }> {
    try {
      // Generate AI-optimized visual prompt based on lesson content
      const visualPrompt = await this.generateVisualPrompt(lessonContent, materialType, lessonContext);
      
      // Generate the visual learning material
      const generationResult = await this.generateImage(
        visualPrompt,
        {
          model: 'dall-e-3',
          size: '1024x1024',
          quality: 'hd',
          style: 'natural'
        },
        lessonContext
      );

      // Generate description and usage guide
      const description = await this.generateVisualDescription(visualPrompt, materialType);
      const usageGuide = this.generateUsageGuide(materialType, lessonContext.sectionTitle);

      // Create comprehensive interaction record
      const interaction: ImageInteraction = {
        id: `visual_learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'current-user',
        type: 'visual-learning',
        prompt: visualPrompt,
        generatedImages: generationResult.images,
        settings: {
          model: 'dall-e-3',
          size: '1024x1024',
          quality: 'hd',
          style: 'natural'
        },
        timestamp: new Date(),
        lessonContext
      };

      this.interactions.push(interaction);

      // Track visual learning analytics
      this.trackImageAnalytics('visual_learning_created', {
        materialType,
        lessonSlug: lessonContext.lessonSlug,
        contentLength: lessonContent.length,
        imageCount: generationResult.images.length
      });

      return {
        visualPrompt,
        generatedImages: generationResult.images,
        description,
        usageGuide,
        interaction
      };
    } catch (error) {
      console.error('Visual Learning Material Creation Error:', error);
      throw new Error('Failed to create visual learning material.');
    }
  }

  // Advanced prompt engineering with templates
  async engineerPrompt(
    basePrompt: string,
    templateId?: string,
    variables?: Record<string, string>
  ): Promise<{
    engineeredPrompt: string;
    improvements: string[];
    template?: PromptTemplate;
    score: number;
  }> {
    try {
      let engineeredPrompt = basePrompt;
      let template: PromptTemplate | undefined;
      
      // Apply template if specified
      if (templateId) {
        template = this.promptTemplates.find(t => t.id === templateId);
        if (template && variables) {
          engineeredPrompt = this.applyTemplate(template, variables);
        }
      }

      // AI-powered prompt optimization
      const optimization = await this.optimizePromptWithAI(engineeredPrompt);
      
      const improvements = [
        'Enhanced clarity and specificity',
        'Improved visual composition guidance',
        'Added style and mood descriptors',
        'Optimized for AI image generation'
      ];

      // Calculate prompt quality score
      const score = this.calculatePromptScore(optimization.optimizedPrompt);

      // Track prompt engineering analytics
      this.trackImageAnalytics('prompt_engineered', {
        originalLength: basePrompt.length,
        optimizedLength: optimization.optimizedPrompt.length,
        templateUsed: templateId || 'none',
        score
      });

      return {
        engineeredPrompt: optimization.optimizedPrompt,
        improvements,
        template,
        score
      };
    } catch (error) {
      console.error('Prompt Engineering Error:', error);
      return {
        engineeredPrompt: basePrompt,
        improvements: ['Basic prompt structure maintained'],
        score: 0.6
      };
    }
  }

  // Get prompt templates by category
  getPromptTemplates(category?: string): PromptTemplate[] {
    if (category) {
      return this.promptTemplates.filter(t => t.category === category);
    }
    return this.promptTemplates;
  }

  // Add custom prompt template
  addPromptTemplate(template: Omit<PromptTemplate, 'id'>): PromptTemplate {
    const newTemplate: PromptTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    this.promptTemplates.push(newTemplate);
    return newTemplate;
  }

  // Rate and provide feedback on generated images
  rateImage(interactionId: string, rating: 1 | 2 | 3 | 4 | 5, comment?: string): void {
    const interaction = this.interactions.find(i => i.id === interactionId);
    if (interaction) {
      interaction.feedback = { rating, comment };
      
      // Track feedback analytics
      this.trackImageAnalytics('image_rated', {
        interactionId,
        rating,
        hasComment: !!comment
      });
    }
  }

  // Get image generation analytics
  getImageAnalytics(): ImageAnalytics {
    const interactions = this.interactions;
    const generations = interactions.filter(i => i.type === 'image-generation');
    const analyses = interactions.filter(i => i.type === 'image-analysis');
    
    // Template usage analysis
    const templateUsage = new Map<string, number>();
    interactions.forEach(i => {
      if (i.promptTemplate) {
        templateUsage.set(i.promptTemplate, (templateUsage.get(i.promptTemplate) || 0) + 1);
      }
    });

    const popularTemplates = Array.from(templateUsage.entries())
      .map(([template, usage]) => ({ template, usage }))
      .sort((a, b) => b.usage - a.usage);

    // Rating analysis
    const ratings = interactions
      .filter(i => i.feedback?.rating)
      .map(i => i.feedback!.rating);
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    // Style and size distribution
    const styleDistribution: Record<string, number> = {};
    const sizeDistribution: Record<string, number> = {};
    const categoryUsage: Record<string, number> = {};

    generations.forEach(interaction => {
      const style = interaction.settings.style || 'natural';
      const size = interaction.settings.size || '1024x1024';
      
      styleDistribution[style] = (styleDistribution[style] || 0) + 1;
      sizeDistribution[size] = (sizeDistribution[size] || 0) + 1;
    });

    return {
      totalGenerations: generations.length,
      totalAnalyses: analyses.length,
      popularTemplates,
      averageRating,
      styleDistribution,
      sizeDistribution,
      categoryUsage
    };
  }

  // Get interaction history
  getImageInteractions(userId?: string, limit: number = 50): ImageInteraction[] {
    let filtered = this.interactions;
    
    if (userId) {
      filtered = filtered.filter(i => i.userId === userId);
    }
    
    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Private helper methods
  private async optimizeImagePrompt(
    prompt: string, 
    context?: { lessonSlug: string; sectionTitle: string }
  ): Promise<string> {
    if (!openai) return prompt;

    try {
      const systemPrompt = `You are an expert at optimizing prompts for AI image generation. 
      Enhance the given prompt to produce better, more educational visual content.
      
      Guidelines:
      - Add specific visual details and composition guidance
      - Include appropriate style descriptors
      - Maintain educational focus
      - Keep prompts clear and concise
      - Add professional, clean aesthetic guidance
      
      ${context ? `Context: This is for a lesson on "${context.sectionTitle}" in the course "${context.lessonSlug}".` : ''}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Optimize this image generation prompt: "${prompt}"` }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content?.replace(/"/g, '') || prompt;
    } catch {
      return prompt;
    }
  }

  private extractInsights(analysis: string): string[] {
    // Extract key insights from image analysis
    const insights: string[] = [];
    
    // Look for educational elements
    if (analysis.toLowerCase().includes('educational')) {
      insights.push('High educational value detected');
    }
    
    // Look for specific concepts
    const concepts = ['diagram', 'chart', 'graph', 'flowchart', 'concept', 'illustration'];
    concepts.forEach(concept => {
      if (analysis.toLowerCase().includes(concept)) {
        insights.push(`Contains ${concept} elements`);
      }
    });
    
    // Look for quality indicators
    if (analysis.toLowerCase().includes('clear') || analysis.toLowerCase().includes('detailed')) {
      insights.push('Clear and detailed visualization');
    }
    
    return insights.slice(0, 5); // Limit to 5 insights
  }

  private calculateEducationalValue(analysis: string): number {
    let score = 0.5; // Base score
    
    const positiveKeywords = ['educational', 'clear', 'detailed', 'informative', 'structured', 'organized'];
    const negativeKeywords = ['unclear', 'confusing', 'messy', 'poor quality'];
    
    positiveKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) score += 0.1;
    });
    
    negativeKeywords.forEach(keyword => {
      if (analysis.toLowerCase().includes(keyword)) score -= 0.1;
    });
    
    return Math.max(0, Math.min(1, score));
  }

  private async generateVisualPrompt(
    content: string, 
    type: string, 
    context: { lessonSlug: string; sectionTitle: string }
  ): Promise<string> {
    if (!openai) {
      return `Create a ${type} illustration for ${context.sectionTitle}`;
    }

    try {
      const systemPrompt = `You are an expert at creating visual learning materials. Generate an optimized image generation prompt for creating a ${type} based on educational content.
      
      Requirements:
      - Professional, educational style
      - Clear, easy to understand visuals
      - Appropriate for AI/ML learning context
      - Include specific visual composition guidance
      - Maintain clean, modern aesthetic`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Create a ${type} prompt for: "${context.sectionTitle}"\n\nContent: ${content.slice(0, 1000)}` 
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0]?.message?.content || `Professional ${type} illustration for ${context.sectionTitle}, clean educational style, modern design`;
    } catch {
      return `Professional ${type} illustration for ${context.sectionTitle}, clean educational style, modern design`;
    }
  }

  private async generateVisualDescription(prompt: string, type: string): Promise<string> {
    return `This ${type} was generated to enhance visual learning and comprehension. The image provides a clear, professional illustration that supports the educational content with visual elements designed to improve understanding and retention.`;
  }

  private generateUsageGuide(type: string, sectionTitle: string): string {
    const guides = {
      diagram: `Use this diagram to explain complex relationships and processes in ${sectionTitle}. Point to specific elements during instruction and encourage students to identify key components.`,
      infographic: `This infographic summarizes key points from ${sectionTitle}. Use it as a study aid, quick reference, or assessment tool. Students can use it for review and knowledge checks.`,
      'concept-map': `This concept map shows the interconnections between ideas in ${sectionTitle}. Use it to help students understand how concepts relate to each other and build comprehensive understanding.`,
      flowchart: `This flowchart illustrates the step-by-step process covered in ${sectionTitle}. Use it to guide students through procedures and help them understand sequence and decision points.`,
      illustration: `This illustration provides visual context for ${sectionTitle}. Use it to make abstract concepts more concrete and help visual learners better understand the material.`
    };

    return guides[type as keyof typeof guides] || `Use this visual aid to enhance understanding of ${sectionTitle}.`;
  }

  private async optimizePromptWithAI(prompt: string): Promise<{ optimizedPrompt: string }> {
    if (!openai) {
      return { optimizedPrompt: prompt };
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt engineer. Optimize the given prompt for better AI image generation results. Make it more specific, detailed, and likely to produce high-quality educational visuals.'
          },
          {
            role: 'user',
            content: `Optimize this prompt: "${prompt}"`
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      return {
        optimizedPrompt: response.choices[0]?.message?.content?.replace(/"/g, '') || prompt
      };
    } catch {
      return { optimizedPrompt: prompt };
    }
  }

  private applyTemplate(template: PromptTemplate, variables: Record<string, string>): string {
    let result = template.template;
    
    template.variables.forEach(variable => {
      const placeholder = `{${variable}}`;
      if (variables[variable]) {
        result = result.replace(new RegExp(placeholder, 'g'), variables[variable]);
      }
    });
    
    return result;
  }

  private calculatePromptScore(prompt: string): number {
    let score = 0.5; // Base score
    
    // Length check (sweet spot is 50-200 characters)
    const length = prompt.length;
    if (length >= 50 && length <= 200) score += 0.2;
    else if (length > 200 && length <= 300) score += 0.1;
    
    // Descriptive words
    const descriptiveWords = ['detailed', 'professional', 'clear', 'modern', 'educational', 'clean', 'high-quality'];
    descriptiveWords.forEach(word => {
      if (prompt.toLowerCase().includes(word)) score += 0.05;
    });
    
    // Style indicators
    if (prompt.includes('style') || prompt.includes('aesthetic')) score += 0.1;
    
    // Composition guidance
    if (prompt.includes('composition') || prompt.includes('layout') || prompt.includes('design')) score += 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  private trackImageAnalytics(event: string, data: Record<string, unknown>): void {
    try {
      console.log(`Image Analytics: ${event}`, data);
      // In production, integrate with your analytics service
    } catch (error) {
      console.error('Image analytics tracking error:', error);
    }
  }

  private initializeTemplates(): void {
    this.promptTemplates = [
      {
        id: 'educational-diagram',
        name: 'Educational Diagram',
        category: 'educational',
        template: 'Professional educational diagram showing {concept}, clean modern style, {color_scheme} color scheme, clear labels, {complexity} complexity level, suitable for {audience}',
        description: 'Creates clear educational diagrams for explaining concepts',
        variables: ['concept', 'color_scheme', 'complexity', 'audience'],
        examples: [
          {
            input: { 
              concept: 'neural network architecture', 
              color_scheme: 'blue and white', 
              complexity: 'intermediate',
              audience: 'AI students'
            },
            output: 'Professional educational diagram showing neural network architecture, clean modern style, blue and white color scheme, clear labels, intermediate complexity level, suitable for AI students'
          }
        ]
      },
      {
        id: 'technical-illustration',
        name: 'Technical Illustration',
        category: 'technical',
        template: 'Technical illustration of {system}, {style} style, showing {components}, {perspective} view, professional quality, educational focus',
        description: 'Creates technical illustrations for complex systems',
        variables: ['system', 'style', 'components', 'perspective'],
        examples: [
          {
            input: {
              system: 'machine learning pipeline',
              style: 'minimalist',
              components: 'data flow and processing stages',
              perspective: 'top-down'
            },
            output: 'Technical illustration of machine learning pipeline, minimalist style, showing data flow and processing stages, top-down view, professional quality, educational focus'
          }
        ]
      },
      {
        id: 'concept-visualization',
        name: 'Concept Visualization',
        category: 'educational',
        template: 'Visual representation of {concept} concept, {visual_style}, incorporating {elements}, designed for {learning_level} learners, {color_palette} palette',
        description: 'Visualizes abstract concepts for better understanding',
        variables: ['concept', 'visual_style', 'elements', 'learning_level', 'color_palette'],
        examples: [
          {
            input: {
              concept: 'reinforcement learning',
              visual_style: 'infographic style',
              elements: 'agent, environment, rewards',
              learning_level: 'beginner',
              color_palette: 'warm'
            },
            output: 'Visual representation of reinforcement learning concept, infographic style, incorporating agent, environment, rewards, designed for beginner learners, warm palette'
          }
        ]
      }
    ];
  }
}

// Export singleton instance
export const imagePrompt = ImagePromptService.getInstance();

// React Hook for Image Prompt Integration
export function useImagePrompt() {
  const generateImage = async (
    prompt: string,
    settings?: Partial<ImagePromptSettings>,
    context?: { lessonSlug: string; sectionTitle: string }
  ) => {
    return await imagePrompt.generateImage(prompt, settings, context);
  };

  const analyzeImage = async (
    imageUrl: string,
    analysisPrompt?: string,
    options?: ImageAnalysisOptions
  ) => {
    return await imagePrompt.analyzeImage(imageUrl, analysisPrompt, options);
  };

  const createVisualLearning = async (
    content: string,
    context: { lessonSlug: string; sectionTitle: string },
    type?: 'diagram' | 'infographic' | 'concept-map' | 'flowchart' | 'illustration'
  ) => {
    return await imagePrompt.createVisualLearningMaterial(content, context, type);
  };

  const engineerPrompt = async (
    basePrompt: string,
    templateId?: string,
    variables?: Record<string, string>
  ) => {
    return await imagePrompt.engineerPrompt(basePrompt, templateId, variables);
  };

  const getTemplates = (category?: string) => imagePrompt.getPromptTemplates(category);
  const addTemplate = (template: Omit<PromptTemplate, 'id'>) => imagePrompt.addPromptTemplate(template);
  const rateImage = (id: string, rating: 1 | 2 | 3 | 4 | 5, comment?: string) => 
    imagePrompt.rateImage(id, rating, comment);
  
  const getAnalytics = () => imagePrompt.getImageAnalytics();
  const getHistory = (limit?: number) => imagePrompt.getImageInteractions(undefined, limit);

  return {
    generateImage,
    analyzeImage,
    createVisualLearning,
    engineerPrompt,
    getTemplates,
    addTemplate,
    rateImage,
    getAnalytics,
    getHistory
  };
}

// Export main image prompt service
export default imagePrompt;
