#!/bin/sh
host="$1"
port="$2"
timeout=15

echo "Waiting for $host:$port..."
while ! nc -z "$host" "$port"; do
  if [ "$timeout" -le 0 ]; then
    echo "Timeout waiting for $host:$port"
    exit 1
  fi
  echo "Waiting... ($timeout seconds left)"
  timeout=$((timeout-1))
  sleep 1
done
echo "$host:$port is available"