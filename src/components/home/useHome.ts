import { useState } from 'react';
import type { Dataset } from '../../core/models/dataset.model';
/* inicio mock */
import {
  MOCK_HOME_DATASETS,
  MOCK_HOME_ORGANIZATIONS,
  MOCK_HOME_TOTALS,
  type MockHomeOrganization,
} from '../../data/mock-home';
/* fin mock */

/* inicio api
import { useEffect, useState } from 'react';
import { organizationsService } from '../../core/services/organizations.service';
import { datasetsService } from '../../core/services/datasets.service';
import type { Dataset, Organization } from '../../core/models/dataset.model';
fin api */

export function useHome() {
  /* inicio mock */
  const [loading] = useState(false);
  const [recentDatasets] = useState<Dataset[]>(MOCK_HOME_DATASETS);
  const [recentOrganizations] = useState<MockHomeOrganization[]>(MOCK_HOME_ORGANIZATIONS);
  const [totalDatasets] = useState(MOCK_HOME_TOTALS.totalDatasets);
  const [totalOrganizations] = useState(MOCK_HOME_TOTALS.totalOrganizations);
  /* fin mock */

  /* inicio api
  const [loading, setLoading] = useState(true);
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([]);
  const [recentOrganizations, setRecentOrganizations] = useState<Organization[]>([]);
  const [totalDatasets, setTotalDatasets] = useState(0);
  const [totalOrganizations, setTotalOrganizations] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [allOrgs, datasets, orgs] = await Promise.all([
          organizationsService.list(),
          datasetsService.listAll(4),
          organizationsService.recent(),
        ]);
        if (!active) return;
        setTotalOrganizations(allOrgs.length);
        setTotalDatasets(allOrgs.reduce((sum, org) => sum + (org._count?.datasets ?? 0), 0));
        setRecentDatasets(datasets);
        setRecentOrganizations(orgs.slice(0, 2));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  fin api */

  return { loading, recentDatasets, recentOrganizations, totalDatasets, totalOrganizations };
}
