# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VidAI is a React-based video analysis application that uses Google's Gemini AI to analyze uploaded videos and provide conversational responses about video content. The application allows users to upload videos, which are processed through Gemini's API, and then engage in chat conversations about the video content.

## Key Architecture

- **Frontend**: React 19 with TypeScript using Vite as the build tool
- **AI Integration**: Google Gemini 2.5 Flash Preview model via `@google/genai` SDK
- **Video Processing**: Videos are uploaded to Gemini's file API and processed asynchronously
- **Chat System**: Real-time chat interface with video context awareness

## Environment Setup

The application requires a `GEMINI_API_KEY` environment variable. The Vite config exposes this as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY` to the client bundle.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build

## Core Services

**geminiService.ts** handles all AI interactions:
- `uploadVideo()` - Uploads video files to Gemini and polls for ACTIVE status
- `generateVideoChatMessage()` - Generates AI responses using video context and user prompts

## Component Structure

The app uses a two-panel layout:
- Left panel: Video upload, video player, and app info
- Right panel: Chat interface with message history and input

Key state management includes:
- Separate loading states for video upload vs AI responses
- Progress tracking for video processing
- Chat message history with user/AI role tracking
- Error handling for upload failures and API issues

## Video Processing Flow

1. User uploads video file
2. File is sent to Gemini's file API
3. System polls for ACTIVE status (up to 2 minutes)  
4. Once active, automatic summary is generated
5. User can then chat about the video content

## TypeScript Configuration

Uses strict TypeScript with bundler module resolution and React JSX transform. Path alias `@/*` points to project root.