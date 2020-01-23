import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { CoreState } from '../core.reducers';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<DSpaceObject> {
  protected linkPath = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DSpaceObject>) {
    super();
  }

  getIDHref(endpoint, resourceID): string {
    return endpoint.replace(/\{\?uuid\}/,`?uuid=${resourceID}`);
  }
}

@Injectable()
@dataService(DSpaceObject.type)
export class DSpaceObjectDataService {
  protected linkPath = 'dso';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected dataBuildService: NormalizedObjectBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DSpaceObject>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, dataBuildService, null, objectCache, halService, notificationsService, http, comparator);
  }

  findById(uuid: string): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findById(uuid);
  }
}
