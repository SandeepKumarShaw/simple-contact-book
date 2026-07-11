const Contact = require('../src/models/Contact');

describe('Contact model validation', () => {
  it('validates a correct contact successfully', () => {
    const contact = new Contact({
      name: 'Jane Doe',
      phone: '1234567890',
      email: 'TEST@EXAMPLE.COM',
      notes: 'This is a valid note.'
    });

    const validationError = contact.validateSync();

    expect(validationError).toBeUndefined();
    expect(contact.email).toBe('test@example.com');
  });

  it('requires name and phone fields', () => {
    const contact = new Contact({});
    const validationError = contact.validateSync();

    expect(validationError).toBeDefined();
    expect(validationError.errors.name).toBeDefined();
    expect(validationError.errors.phone).toBeDefined();
  });

  it('rejects a phone number that is not exactly 10 digits', () => {
    const contact = new Contact({
      name: 'John Doe',
      phone: '98765'
    });
    const validationError = contact.validateSync();

    expect(validationError).toBeDefined();
    expect(validationError.errors.phone).toBeDefined();
    expect(validationError.errors.phone.message).toMatch(/valid 10-digit phone number/i);
  });

  it('rejects notes longer than 200 characters', () => {
    const contact = new Contact({
      name: 'John Doe',
      phone: '1234567890',
      notes: 'x'.repeat(201)
    });
    const validationError = contact.validateSync();

    expect(validationError).toBeDefined();
    expect(validationError.errors.notes).toBeDefined();
  });
});
