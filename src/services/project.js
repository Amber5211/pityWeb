import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function listProject(params) {
  return request(`${CONFIG.URL}/project/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function insertProject(params) {
  return request(`${CONFIG.URL}/project/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function queryProject(params) {
  return request(`${CONFIG.URL}/project/query`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function updateProject(params) {
  return request(`${CONFIG.URL}/project/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function insertProjectRole(params) {
  return request(`${CONFIG.URL}/project/role/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateProjectRole(params) {
  return request(`${CONFIG.URL}/project/role/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteProjectRole(params) {
  return request(`${CONFIG.URL}/project/role/delete`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
