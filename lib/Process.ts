import { OrchestratorApi } from 'uipath-orchestrator-api-node'

export class Process {

}

export class UiPathProcess extends Process {
  api: OrchestratorApi
  processName: string
  process: object
  processInfo: object
  authenticated: boolean

  constructor(processName: string, process: object, source: object) {
    super()
    this.api = new OrchestratorApi(source)
    this.processName = processName
    this.process = process
    this.authenticated = false
  }

  async authenticate() {
    if (!this.authenticated) {
      await this.api.authenticate()
      this.authenticated = true
    }
  }

  async start(inputArgs: object) {
    await this.authenticate()
    // _startJobs is private and the only way to start a "JobsCount" strategy
    // @ts-ignore
    return await this.api.job._startJobs({
        startInfo: {
          ReleaseKey: this.processInfo['Key'],
          RobotIds: [],
          JobsCount: 1,
          Strategy: 'JobsCount',
          InputArguments: JSON.stringify(inputArgs),
        }
      })
  }

  async info(force: boolean) {
    await this.authenticate()
    this.processInfo = await this.api.release.findByProcessKey(this.processName)
    // get the processes information and store it on the class instance
    // Don't refetch unless it's forced
  }


}