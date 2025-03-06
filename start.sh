#!/bin/bash
set -xe

# Start Ollama in the background
ollama serve &

sleep 5

# Once Ollama is ready, pull the model
ollama pull llama3.2:latest

# Keep the script running
wait
