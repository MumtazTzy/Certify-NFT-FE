// src/api/events.ts

export async function createEventFormData(formData: FormData): Promise<any> {
  const response = await fetch('https://api.gpadaka.com/api3/api/events/create', {
    method: 'POST',
    body: formData, // browser auto sets boundary
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create event');
  }

  return await response.json();
}
