import { Alert } from '@/components';

export type Feedback = { message: string; status: 'error' | 'success' } | null;

interface FormFeedbackProps {
  feedback: Feedback;
  onClose: () => void;
}

function FormFeedback({ feedback, onClose }: FormFeedbackProps) {
  if (!feedback) return null;
  return <Alert status={feedback.status} title={feedback.message} onClose={onClose} />;
}

export default FormFeedback;
