import { Client } from '../../src';
import { Project } from '../../src/types';

const PROJECT = '1JobmsdABKxoE30PjtgEMz';

describe('Client basic requests', () => {
  let client: Client;
  let project: Project;
  beforeEach(() => {
    client = new Client({ environment: 'staging' });
    project = client.project(PROJECT);
  });

  it('should query entities', async () => {
    const entities = await project.entities.query({
      query: {
        $field: {
          $type: 'text'
        }
      }
    });
    expect(Array.isArray(entities)).toBe(true);
    expect(typeof entities[0]._id === 'string').toBe(true);
    expect(entities[0].data()).toBeTruthy();
  });

  it('should get an entity by id', async () => {
    const entity = await project.entities.get('2t8OIdFsV8DB8jwybSFq0A');
    expect(entity.get('title')).not.toBeFalsy();
  });

  it('should list files', async () => {
    const files = await project.files.list();
    expect(Array.isArray(files)).toBe(true);
    expect(files[0]._id).toBeTruthy();
    expect(files[0].mimeType).toBeTruthy();
  });

  it('should get a file by id', async () => {
    const file = await project.files.get('1McQf7m1m62hTfGTQuCSDh');
    expect(file.mimeType).toBe('image/jpeg');
  });

  it('should list tags', async () => {
    const tags = await project.tags.list();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags[0].name).toBeDefined();
  });

  it('should throw error if API returns occurs', async () => {
    try {
      await project.entities.get('unknownABCDEFGHIJKLmna');
      fail('should throw error');
    } catch (e) {
      expect(e.message).toBeDefined();
    }
  });
});