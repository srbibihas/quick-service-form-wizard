
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectDetails as ProjectDetailsType } from '@/types/booking';

interface ProjectDetailsProps {
  projectDetails: ProjectDetailsType;
  onUpdate: (details: ProjectDetailsType) => void;
  errors: Record<string, string>;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  projectDetails,
  onUpdate,
  errors
}) => {
  const updateField = (field: keyof ProjectDetailsType, value: string) => {
    onUpdate({ ...projectDetails, [field]: value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Information</h2>
        <p className="text-gray-600">Tell us more about your project requirements</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="description" className="text-base font-medium">
            Project Description *
          </Label>
          <Textarea
            id="description"
            value={projectDetails.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Please describe your project in detail. What are your goals, target audience, and any specific requirements?"
            className={`mt-2 min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <Label htmlFor="timeline" className="text-base font-medium">
            Preferred Timeline *
          </Label>
          <Select
            value={projectDetails.timeline}
            onValueChange={(value) => updateField('timeline', value)}
          >
            <SelectTrigger className={`mt-2 ${errors.timeline ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select your timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rush">Rush (1-3 days) - +50% fee</SelectItem>
              <SelectItem value="week">Within a week</SelectItem>
              <SelectItem value="2weeks">Within 2 weeks</SelectItem>
              <SelectItem value="month">Within a month</SelectItem>
              <SelectItem value="flexible">Flexible timeline</SelectItem>
            </SelectContent>
          </Select>
          {errors.timeline && (
            <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget" className="text-base font-medium">
            Budget Range *
          </Label>
          <Select
            value={projectDetails.budget}
            onValueChange={(value) => updateField('budget', value)}
          >
            <SelectTrigger className={`mt-2 ${errors.budget ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-500">Under $500</SelectItem>
              <SelectItem value="500-1000">$500 - $1,000</SelectItem>
              <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
              <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
              <SelectItem value="over-5000">Over $5,000</SelectItem>
              <SelectItem value="discuss">Prefer to discuss</SelectItem>
            </SelectContent>
          </Select>
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
          )}
        </div>

        <div>
          <Label htmlFor="instructions" className="text-base font-medium">
            Special Instructions
          </Label>
          <Textarea
            id="instructions"
            value={projectDetails.instructions}
            onChange={(e) => updateField('instructions', e.target.value)}
            placeholder="Any additional information, special requirements, or preferences we should know about?"
            className="mt-2"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Project Tips</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Be as specific as possible about your requirements</li>
          <li>• Include any inspiration or reference materials</li>
          <li>• Mention your target audience and goals</li>
          <li>• Let us know about any technical constraints</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectDetails;
