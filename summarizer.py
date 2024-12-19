from openai import OpenAI
from youtube_transcript_api import YouTubeTranscriptApi

client = OpenAI()
url = 'https://www.youtube.com/watch?v=Zjp_zwyca4Q'
video_id = url.replace('https://www.youtube.com/watch?v=', '')
transcript = YouTubeTranscriptApi.get_transcript(video_id)

ans=""
for x in transcript:
  ans+=x['text']

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": f"""
            You are a helpful assistant. Summarize the following video transcript in two parts:
            1. At the top, write a summary that identifies the main takeaways of the video.
            2. Provide a chronological summary of the video, highlighting key points as they happen.

            Here is the transcript: {ans}"""
        }
    ]
)

print(completion.choices[0].message.content)
