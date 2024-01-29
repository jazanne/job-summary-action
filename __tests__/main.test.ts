/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let errorMock: jest.SpyInstance
let getMultilineInputMock: jest.SpyInstance
let setSummaryMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getMultilineInputMock = jest
      .spyOn(core, 'getMultilineInput')
      .mockImplementation()
    setSummaryMock = jest.spyOn(core.summary, 'addRaw').mockImplementation()
  })

  it('sets the job summary', async () => {
    // Set the action's inputs as return values from core.getInput()
    getMultilineInputMock.mockImplementation((name: string): string[] => {
      switch (name) {
        case 'summary':
          return ['Just a test']
        default:
          return []
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setSummaryMock).toHaveBeenNthCalledWith(1, 'Just a test', true)
    expect(errorMock).not.toHaveBeenCalled()
  })
})
