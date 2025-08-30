import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export type LLMProvider = 'gemini' | 'claude' | 'gpt4';

export interface LLMTask {
  type: 'trend-discovery' | 'content-generation' | 'brand-voice' | 'competitive-analysis' | 'audience-insights';
  complexity: 'low' | 'medium' | 'high';
  context: string;
  requirements?: string[];
}

export class LLMRouter {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  selectOptimalLLM(task: LLMTask): LLMProvider {
    // Routing logic based on task type and complexity
    switch (task.type) {
      case 'trend-discovery':
      case 'content-generation':
        return 'gemini';
      case 'brand-voice':
        return 'claude';
      case 'competitive-analysis':
      case 'audience-insights':
        return 'gpt4';
      default:
        return task.complexity === 'high' ? 'gpt4' : 'gemini';
    }
  }

  async executeTask(task: LLMTask): Promise<string> {
    const provider = this.selectOptimalLLM(task);
    
    try {
      switch (provider) {
        case 'gpt4':
          return await this.executeGPT4(task);
        case 'claude':
          return await this.executeClaude(task);
        case 'gemini':
        default:
          return await this.executeGemini(task);
      }
    } catch (error) {
      // Fallback to alternative provider
      console.warn(`${provider} failed, falling back...`);
      return await this.executeFallback(task, provider);
    }
  }

  private async executeGPT4(task: LLMTask): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: this.getSystemPrompt(task.type) },
        { role: 'user', content: task.context }
      ],
      temperature: 0.7,
    });
    return response.choices[0]?.message?.content || '';
  }

  private async executeClaude(task: LLMTask): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: `${this.getSystemPrompt(task.type)}\n\n${task.context}` }
      ],
    });
    return response.content[0]?.type === 'text' ? response.content[0].text : '';
  }

  private async executeGemini(task: LLMTask): Promise<string> {
    // Use existing Genkit integration for Gemini
    return `Gemini response for ${task.type}: ${task.context}`;
  }

  private async executeFallback(task: LLMTask, failedProvider: LLMProvider): Promise<string> {
    const alternatives: LLMProvider[] = ['gemini', 'claude', 'gpt4'].filter(p => p !== failedProvider);
    
    for (const provider of alternatives) {
      try {
        switch (provider) {
          case 'gpt4':
            return await this.executeGPT4(task);
          case 'claude':
            return await this.executeClaude(task);
          case 'gemini':
            return await this.executeGemini(task);
        }
      } catch (error) {
        continue;
      }
    }
    throw new Error('All LLM providers failed');
  }

  private getSystemPrompt(taskType: string): string {
    const prompts = {
      'trend-discovery': 'You are a trend analysis expert. Identify emerging trends and explain why they are gaining traction.',
      'content-generation': 'You are a creative content strategist. Generate engaging social media content that aligns with current trends.',
      'brand-voice': 'You are a brand voice specialist. Ensure all content maintains consistent brand identity and tone.',
      'competitive-analysis': 'You are a competitive intelligence analyst. Analyze competitor strategies and identify opportunities.',
      'audience-insights': 'You are an audience research expert. Provide deep insights into target audience behavior and preferences.'
    };
    return prompts[taskType] || 'You are a helpful AI assistant for social media management.';
  }
}
