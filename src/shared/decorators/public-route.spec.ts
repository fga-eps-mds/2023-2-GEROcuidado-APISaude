import { PublicRoute } from './public-route.decorator';

describe('Pagination', () => {
  it('should be defined', () => {
    PublicRoute();
    expect(PublicRoute).toBeDefined();
  });
});
