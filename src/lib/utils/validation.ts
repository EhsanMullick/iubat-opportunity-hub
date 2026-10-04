import { z } from 'zod';

export const EVENT_CATEGORIES = [
  'Concerts & Cultural',
  'Seminars & Conferences',
  'Workshops & Training',
  'Hackathons & Contests',
  'University & Club',
  'Career & Networking',
  'Sports & Fitness',
  'Community & Social',
] as const;

export const eventFormSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: 'Event title must be at least 3 characters' })
      .max(150, { message: 'Event title cannot exceed 150 characters' }),
    description: z
      .string()
      .min(20, { message: 'Description must be at least 20 characters to provide clear details' })
      .max(5000, { message: 'Description is too long' }),
    category: z.enum(EVENT_CATEGORIES, {
      errorMap: () => ({ message: 'Please select a valid event category' }),
    }),
    poster_url: z
      .string()
      .url({ message: 'Please provide a valid image URL for the event poster' }),
    start_datetime: z
      .string()
      .min(1, { message: 'Start date and time is required' })
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date format' }),
    end_datetime: z
      .string()
      .min(1, { message: 'End date and time is required' })
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date format' }),
    venue_name: z
      .string()
      .min(2, { message: 'Venue name is required (e.g., IUBAT Auditorium, BICC)' }),
    venue_address: z
      .string()
      .min(5, { message: 'Full venue address is required' }),
    city: z
      .string()
      .min(2, { message: 'City is required' }),
    latitude: z
      .number({ invalid_type_error: 'Latitude must be a valid number' })
      .min(-90, { message: 'Latitude must be >= -90' })
      .max(90, { message: 'Latitude must be <= 90' }),
    longitude: z
      .number({ invalid_type_error: 'Longitude must be a valid number' })
      .min(-180, { message: 'Longitude must be >= -180' })
      .max(180, { message: 'Longitude must be <= 180' }),
    registration_url: z
      .string()
      .url({ message: 'Must be a valid URL starting with http:// or https://' })
      .optional()
      .or(z.literal('')),
    ticket_price: z
      .number({ invalid_type_error: 'Ticket price must be a number' })
      .min(0, { message: 'Price cannot be negative' })
      .default(0),
    currency: z.string().default('BDT'),
    capacity: z
      .number()
      .int()
      .positive({ message: 'Capacity must be greater than 0' })
      .optional()
      .nullable(),
    contact_email: z
      .string()
      .email({ message: 'Invalid contact email' })
      .optional()
      .or(z.literal('')),
    contact_url: z
      .string()
      .url({ message: 'Invalid contact URL' })
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_datetime);
      const end = new Date(data.end_datetime);
      return end.getTime() > start.getTime();
    },
    {
      message: 'End date & time must be strictly later than start date & time',
      path: ['end_datetime'],
    }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const studentProfileSchema = z.object({
  display_name: z.string().min(2, 'Name is required'),
  student_id: z.string().optional(),
  department: z.string().optional(),
  skills: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  career_goals: z.string().optional(),
});

export type StudentProfileValues = z.infer<typeof studentProfileSchema>;
