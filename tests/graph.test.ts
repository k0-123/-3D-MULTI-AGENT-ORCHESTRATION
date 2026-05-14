import { describe, it, expect } from 'vitest';
import { routeAfterWorker, routeAfterReview } from '../src/lib/agent-graph/graph';

describe('Graph Routing Logic', () => {
  it('routes to review after worker if any step in group requires review', () => {
    const state = {
      roadmap: [{ id: '1', agentId: 'A', reviewRequired: true, group: 'A' }],
      currentStepIndex: 0,
      useOpenDesign: true
    };
    // @ts-ignore
    const nextNode = routeAfterWorker(state);
    expect(nextNode).toBe('review');
  });

  it('routes to advance after worker if group does not require review', () => {
    const state = {
      roadmap: [{ id: '1', agentId: 'A', reviewRequired: false, group: 'A' }],
      currentStepIndex: 0,
      useOpenDesign: true
    };
    // @ts-ignore
    const nextNode = routeAfterWorker(state);
    expect(nextNode).toBe('advance');
  });

  it('routes to end after worker if no current step exists', () => {
    const state = {
      roadmap: [],
      currentStepIndex: 0,
      useOpenDesign: true
    };
    // @ts-ignore
    const nextNode = routeAfterWorker(state);
    expect(nextNode).toBe('end');
  });

  it('routes back to worker after review if rejected and retries remain', () => {
    const state = {
      reviewFeedback: 'Fix this',
      retryCount: 0,
      currentStepIndex: 0,
      roadmap: [{ id: '1' }]
    };
    // @ts-ignore
    const nextNode = routeAfterReview(state);
    expect(nextNode).toBe('worker');
  });

  it('routes to worker/end after review if approved', () => {
    const state = {
      reviewFeedback: null,
      currentStepIndex: 1,
      roadmap: [{ id: '1' }]
    };
    // @ts-ignore
    const nextNode = routeAfterReview(state);
    expect(nextNode).toBe('end');
  });
});
