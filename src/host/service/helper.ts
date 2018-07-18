import { Premiere } from '../../shared'

export class Helper implements Premiere.HelperApi {
  version() {
    return Promise.resolve("")
  }
}
