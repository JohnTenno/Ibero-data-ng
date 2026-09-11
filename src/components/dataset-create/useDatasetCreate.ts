import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { datasetsService } from '../../core/services/datasets.service';
import { errorMessage } from '../../core/api/http';
import type {
  Dataset,
  DatasetVisibility,
  PeriodType,
  Survey,
} from '../../core/models/dataset.model';

export function useDatasetCreate() {
  const { organizationId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revisionOf, setRevisionOf] = useState<Dataset | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<DatasetVisibility>('PRIVATE');
  const [survey, setSurvey] = useState<Survey | ''>('');
  const [year, setYear] = useState('');
  const [periodType, setPeriodType] = useState<PeriodType | ''>('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [changelog, setChangelog] = useState('');

  useEffect(() => {
    const revisionOfId = searchParams.get('revisionOf');
    if (!revisionOfId) return;
    let active = true;
    (async () => {
      const original = await datasetsService.get(organizationId, revisionOfId);
      if (!active) return;
      setRevisionOf(original);
      setTitle(`${original.title} (revisión)`);
    })();
    return () => {
      active = false;
    };
  }, [organizationId, searchParams]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !slug) return;
    setSaving(true);
    setError(null);
    try {
      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const dataset = await datasetsService.create(organizationId, {
        title,
        slug,
        description: description || undefined,
        visibility,
        survey: survey || undefined,
        year: year ? Number(year) : undefined,
        periodType: periodType || undefined,
        sourceOrg: sourceOrg || undefined,
        sourceUrl: sourceUrl || undefined,
        tags: tags.length > 0 ? tags : undefined,
        licenseId: licenseId || undefined,
        revisionOfId: revisionOf?.id,
        changelog: changelog || undefined,
      });
      navigate(`/organizations/${organizationId}/datasets/${dataset.id}`);
    } catch (err) {
      setError(errorMessage(err, 'No se pudo crear el dataset (¿el slug ya existe?).'));
    } finally {
      setSaving(false);
    }
  };

  return {
    organizationId,
    saving,
    error,
    revisionOf,
    fields: {
      title,
      setTitle,
      slug,
      setSlug,
      description,
      setDescription,
      visibility,
      setVisibility,
      survey,
      setSurvey,
      year,
      setYear,
      periodType,
      setPeriodType,
      sourceOrg,
      setSourceOrg,
      sourceUrl,
      setSourceUrl,
      tagsText,
      setTagsText,
      licenseId,
      setLicenseId,
      changelog,
      setChangelog,
    },
    submit,
  };
}
